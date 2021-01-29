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
  ...args: infer P
) => any
  ? (...args: P) => HTMLElement
  : never;

export type GetChainableConnectors<H extends Handlers> = {
  [T in keyof ReturnType<H['handlers']>]: ReturnType<H['handlers']>[T] extends (
    ...args: any
  ) => any
    ? ChainableConnector<ReturnType<H['handlers']>[T]>
    : never;
};

export abstract class Handlers {
  private registry: ConnectorRegistry = new ConnectorRegistry();
  private subscribers: Set<(...args: any[]) => void> = new Set();
  private bindedEventListeners: WeakMap<
    CraftEventListener<any>,
    CraftEventListener<any>
  > = new WeakMap();

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

    this.bindedEventListeners.set(listener, bindedListener);
    el.addEventListener(eventName, bindedListener, options);

    return () =>
      this.removeCraftEventListener(el, eventName, listener, options);
  }

  removeCraftEventListener<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    eventName: K,
    listener: CraftEventListener<K>,
    options?: boolean | EventListenerOptions
  ) {
    const bindedListener = this.bindedEventListeners.get(listener) || listener;
    return el.removeEventListener(eventName, bindedListener, options);
  }

  // Defines the connectors and their logic
  abstract handlers(): Record<string, (el: HTMLElement, ...args: any[]) => any>;

  connectors(): GetChainableConnectors<this> {
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

  derive(t: any, ...args) {
    return new t(this, ...args);
  }
}
