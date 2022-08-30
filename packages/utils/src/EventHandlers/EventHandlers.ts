import { ConnectorRegistry } from './ConnectorRegistry';
import {
  EventHandlerUpdates,
  CraftEventListener,
  EventHandlerConnectors,
  CraftDOMEvent,
  Connector,
  ConnectorsUsage,
  RegisteredConnector,
} from './interfaces';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';

export abstract class EventHandlers<O extends Record<string, any> = {}> {
  options: O;

  private registry: ConnectorRegistry = new ConnectorRegistry();
  private subscribers: Set<(msg: EventHandlerUpdates) => void> = new Set();

  onEnable?(): void;
  onDisable?(): void;

  constructor(options?: O) {
    this.options = options;
  }

  listen(cb: (msg: EventHandlerUpdates) => void) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  disable() {
    if (this.onDisable) {
      this.onDisable();
    }

    this.registry.disable();

    this.subscribers.forEach((listener) => {
      listener(EventHandlerUpdates.HandlerDisabled);
    });
  }

  enable() {
    if (this.onEnable) {
      this.onEnable();
    }

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
    const bindedListener = (e: CraftDOMEvent<HTMLElementEventMap[K]>) => {
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

  /**
   * Creates a record of chainable connectors and tracks their usages
   */
  createConnectorsUsage(): ConnectorsUsage<this> {
    const handlers = this.handlers();

    // Track all active connector ids here
    // This is so we can return a cleanup method below so the callee can programmatically cleanup all connectors

    const activeConnectorIds: Set<string> = new Set();

    let canRegisterConnectors = false;
    const connectorsToRegister: Map<
      string,
      () => RegisteredConnector
    > = new Map();

    const connectors = Object.entries(handlers).reduce<
      Record<string, Connector>
    >(
      (accum, [name, handler]) => ({
        ...accum,
        [name]: (el, required, options) => {
          const registerConnector = () => {
            const connector = this.registry.register(el, {
              required,
              name,
              options,
              connector: handler,
            });

            activeConnectorIds.add(connector.id);
            return connector;
          };

          connectorsToRegister.set(
            this.registry.getConnectorId(el, name),
            registerConnector
          );

          /**
           * If register() has been called,
           * register the connector immediately.
           *
           * Otherwise, registration is deferred until after register() is called
           */
          if (canRegisterConnectors) {
            registerConnector();
          }

          return el;
        },
      }),
      {}
    ) as any;

    return {
      connectors,
      register: () => {
        canRegisterConnectors = true;

        connectorsToRegister.forEach((registerConnector) => {
          registerConnector();
        });
      },
      cleanup: () => {
        canRegisterConnectors = false;

        activeConnectorIds.forEach((connectorId) =>
          this.registry.remove(connectorId)
        );
      },
    };
  }

  derive<C extends EventHandlers>(
    type: {
      new (...args: any[]): C;
    },
    opts: C['options']
  ) {
    return new type(this, opts);
  }

  // This method allows us to execute multiple connectors and returns a single cleanup method for all of them
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

  // This lets us to execute and cleanup sibling connectors
  reflect(cb: (connectors: EventHandlerConnectors<this>) => void) {
    return this.createProxyHandlers(this, cb);
  }
}
