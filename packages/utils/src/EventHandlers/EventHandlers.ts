import { ConnectorRegistry } from './ConnectorRegistry';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';
import {
  EventHandlerUpdates,
  CraftEventListener,
  EventHandlerConnectors,
} from './interfaces';

export abstract class EventHandlers<O extends Record<string, any> = {}> {
  options: O;

  private registry: ConnectorRegistry = new ConnectorRegistry();
  private subscribers: Set<(msg: EventHandlerUpdates) => void> = new Set();

  constructor(options?: O) {
    this.options = options;
  }

  listen(cb: (msg: EventHandlerUpdates) => void) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  disable() {
    this.registry.disable();

    this.subscribers.forEach((listener) => {
      listener(EventHandlerUpdates.HandlerDisabled);
    });
  }

  enable() {
    this.registry.enable();

    this.subscribers.forEach((listener) => {
      listener(EventHandlerUpdates.HandlerEnabled);
    });
  }

  cleanup() {
    this.disable();
    this.subscribers.clear();
    this.registry.clear();
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

    return () => el.removeEventListener(eventName, bindedListener, options);
  }

  // Defines the connectors and their logic
  abstract handlers(): Record<string, (el: HTMLElement, ...args: any[]) => any>;

  get connectors(): EventHandlerConnectors<this> {
    const connectors = this.handlers();
    return Object.keys(connectors).reduce(
      (accum, connectorName) => ({
        ...accum,
        [connectorName]: (el, opts) => {
          this.registry.register(el, {
            opts,
            name: connectorName,
            connector: connectors[connectorName],
          });
          return el;
        },
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
    cb: (connectors: EventHandlerConnectors<H>) => void
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

  reflect(cb: (connectors: EventHandlerConnectors<this>) => void) {
    return this.createProxyHandlers(this, cb);
  }
}
