import { wrapHookToRecognizeElement } from '@craftjs/utils';
import isEqual from 'shallowequal';

import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';

export abstract class Handlers {
  private registry: Record<string, Map<HTMLElement, any>> = {};
  private listeners: any[] = [];
  private eventListeners: WeakMap<any, any> = new WeakMap();

  listen(cb: any) {
    this.listeners.push(cb);
    return () => this.listeners.splice(this.listeners.indexOf(cb), 1);
  }

  disable() {
    Object.keys(this.registry).forEach((key) => {
      const registry = this.registry[key];

      registry.forEach((r) => {
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
    this.listeners = [];
    this.registry = {};
  }

  abstract handlers();

  protected dom(el: HTMLElement) {
    return new Proxy(el, {
      get: (target, key, receiver) => {
        switch (key) {
          case '__target__': {
            return el;
          }
          case 'addEventListener': {
            return (eventName, listener, capture) => {
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

              this.eventListeners.set(listener, bindedListener);
              return el.addEventListener(eventName, bindedListener, capture);
            };
          }
          case 'removeEventListener': {
            return (eventName, listener, capture) => {
              const bindedListener =
                this.eventListeners.get(listener) || listener;
              return el.removeEventListener(eventName, bindedListener, capture);
            };
          }
          default: {
            const result = Reflect.get(target, key, receiver);
            if (typeof result === 'function') {
              return result.bind(target);
            }

            return result;
          }
        }
      },
    });
  }

  connectors(): any {
    const connectors = this.handlers();

    return Object.keys(connectors).reduce((accum, key) => {
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
        this.registry[key].set(el, {
          opts,
          enable: () => {
            cleanup = connectors[key](el, opts);
          },
          disable: () => {
            if (cleanup) {
              cleanup();
            }
          },
        });

        this.registry[key].get(el).enable();
      });

      return accum;
    }, {});
  }
}
