import { Connector, wrapHookToRecognizeElement } from '@craftjs/utils';
import isEqual from 'shallowequal';

import { Handler } from '../interfaces/events';
import { EditorStore } from '../editor';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';

type CoreConnectorTypes =
  | 'select'
  | 'hover'
  | 'drag'
  | 'drop'
  | 'create'
  | 'connect';

export abstract class Handlers {
  private registry: Record<string, Map<HTMLElement, any>> = {};
  private derivedHandlers: Set<any> = new Set();
  private listeners: any[] = [];

  listen(cb: any) {
    this.listeners.push(cb);
    return () => this.listeners.splice(this.listeners.indexOf(cb), 1);
  }

  /**
   * Create a new instance of Handlers with reference to the current EventHandlers
   * @param type A class that extends DerivedEventHandlers
   * @param args Additional arguments to pass to the constructor
   */
  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    Derived: any,
    ...args: U
  ): T {
    return new Derived(this, ...args);
  }

  abstract handlers(): any;

  disable() {
    Object.keys(this.registry).forEach((key) => {
      const registry = this.registry[key];

      registry.forEach((r) => {
        // console.log('disabling', r.name, key, r);
        r.disable();
      });
    });

    this.listeners.forEach((listener) => listener(false));
  }

  enable() {
    Object.keys(this.registry).forEach((key) => {
      const registry = this.registry[key];
      registry.forEach((r) => r.enable());
    });

    this.listeners.forEach((listener) => listener(true));
  }

  cleanup() {
    this.disable();
    this.derivedHandlers = new Set();
    this.registry = {};
  }

  // Returns ref connectors for handlers
  connectors(): any {
    const handlers = this.handlers() || {};

    return Object.keys(handlers).reduce((accum, key) => {
      const { init, events } = {
        init: null,
        events: [],
        ...handlers[key],
      };

      if (!this.registry[key]) {
        this.registry[key] = new Map();
      }

      accum[key] = wrapHookToRecognizeElement((el, opts) => {
        if (this.registry[key].get(el)) {
          if (isEqual(opts, this.registry[key].get(el).opts)) {
            return;
          }

          this.registry[key].get(el).disable();
        }

        let cleanup;
        let listenersToRemove;

        this.registry[key].set(el, {
          opts,
          enable: () => {
            if (init) {
              cleanup = init(el, opts);
            }

            listenersToRemove = events.map(([eventName, listener, capture]) => {
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

                  listener(e, opts);
                }
              };
              el.addEventListener(eventName, bindedListener, capture);
              return () => {
                el.removeEventListener(eventName, bindedListener, capture);
              };
            });
          },
          disable: () => {
            if (cleanup) {
              cleanup();
            }
            if (listenersToRemove) {
              listenersToRemove.forEach((l) => l());
              listenersToRemove = null;
            }
          },
        });

        this.registry[key].get(el).enable();
      });

      return accum;
    }, {}) as any;
  }
}
/**
 * Craft's core event handlers
 * Connectors are created from the handlers defined here
 */
export abstract class CoreEventHandlers extends Handlers {
  store: EditorStore;
  constructor(store: EditorStore) {
    super();
    this.store = store;
  }
}

/**
 *  Allows for external packages to easily extend and derive the CoreEventHandlers
 */
export abstract class DerivedEventHandlers extends Handlers {
  derived: Handlers;
  unsubscribeListener: any = null;

  constructor(derived: Handlers) {
    super();
    this.derived = derived;
    this.unsubscribeListener = this.derived.listen((bool) => {
      if (!bool) {
        this.disable();
        return;
      }

      this.enable();
    });
  }

  cleanup() {
    super.cleanup();
    this.unsubscribeListener();
  }
}

export type EventConnectors = any;
