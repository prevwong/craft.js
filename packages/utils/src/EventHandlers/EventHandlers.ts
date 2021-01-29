import { ConnectorRegistry } from './ConnectorRegistry';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';
import { wrapHookToRecognizeElement } from './wrapConnectorHooks';

export type CraftDOMEvent<T extends Event> = T & {
  craft: {
    stopPropagation: () => void;
    blockedEvents: Record<string, boolean>;
  };
};

export type CraftEventListener<K extends keyof HTMLElementEventMap> = (
  ev: CraftDOMEvent<HTMLElementEventMap[K]>
) => any;

export type ChainableConnector<T extends (...args: any) => any> = T extends (
  element: infer E,
  ...args: infer P
) => any
  ? (element: E, ...args: P) => E
  : never;

export type ChainableConnectors<H extends EventHandlers> = {
  [T in keyof ReturnType<H['handlers']>]: ReturnType<H['handlers']>[T] extends (
    ...args: any
  ) => any
    ? ChainableConnector<ReturnType<H['handlers']>[T]>
    : never;
};

export abstract class EventHandlers<O extends Record<string, any> = {}> {
  private registry: ConnectorRegistry = new ConnectorRegistry();
  private subscribers: Set<(...args: any[]) => void> = new Set();

  options: O;

  constructor(options: O) {
    this.options = options;
  }

  listen(cb: any) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  disable() {
    this.registry.disable();

    this.subscribers.forEach((listener) => {
      listener(false);
    });
  }

  enable() {
    this.registry.enable();

    this.subscribers.forEach((listener) => {
      listener(true);
    });
  }

  cleanup() {
    this.disable();
    this.subscribers.clear();
  }

  addCraftEventListener<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    eventName: K,
    listener: CraftEventListener<K>,
    options?: boolean | AddEventListenerOptions
  ) {
    const bindedListener = (e) => {
      // Store initial Craft event value
      if (!e.craft) {
        e.craft = {
          blockedEvents: {},
          stopPropagation: () => {},
        };
      }

      if (!isEventBlockedByDescendant(e, eventName, el)) {
        e.craft.stopPropagation = () => {
          if (!e.craft.blockedEvents[eventName]) {
            e.craft.blockedEvents[eventName] = [];
          }

          e.craft.blockedEvents[eventName].push(el);
        };

        listener(e);
      }
    };

    el.addEventListener(eventName, bindedListener, options);

    return () => el.addEventListener(eventName, bindedListener, options);
  }

  // Defines the connectors and their logic
  abstract handlers(): Record<string, (el: HTMLElement, ...args: any[]) => any>;

  get connectors(): ChainableConnectors<this> {
    const connectors = this.handlers();
    return Object.keys(connectors).reduce(
      (accum, connectorName) => ({
        ...accum,
        [connectorName]: wrapHookToRecognizeElement((el, opts) => {
          this.registry.register(el, {
            opts,
            name: connectorName,
            connector: connectors[connectorName],
          });
        }),
      }),
      {}
    ) as any;
  }

  derive<C extends EventHandlers>(
    type: {
      new (...args: any[]): C;
    },
    opts: C['options']
  ) {
    return new type(this, opts);
  }

  protected createProxyHandlers<H extends EventHandlers>(
    instance: H,
    cb: (connectors: ChainableConnectors<H>) => void
  ) {
    const connectorsToCleanup = [];
    const handlers = instance.handlers();

    const proxiedHandlers = new Proxy(handlers, {
      get: (target, key: any, receiver) => {
        if (key in handlers === false) {
          return Reflect.get(target, key, receiver);
        }

        return (el, ...args) => {
          const cleanup = handlers[key](el, ...args);
          if (!cleanup) {
            return;
          }

          connectorsToCleanup.push(cleanup);
        };
      },
    });

    cb(proxiedHandlers as any);

    return () => {
      connectorsToCleanup.forEach((cleanup) => {
        cleanup();
      });
    };
  }

  reflect(cb: (connectors: ChainableConnectors<this>) => void) {
    return this.createProxyHandlers(this, cb);
  }
}
