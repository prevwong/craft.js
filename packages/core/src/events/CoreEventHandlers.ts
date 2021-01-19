import { Connector, wrapHookToRecognizeElement } from '@craftjs/utils';
import isEqual from 'shallowequal';

import { EditorStore } from '../editor/store';
import { Handler } from '../interfaces';

type CoreConnectorTypes =
  | 'select'
  | 'hover'
  | 'drag'
  | 'drop'
  | 'create'
  | 'connect';

/**
 * Craft's core event handlers
 * Connectors are created from the handlers defined here
 */
export abstract class CoreEventHandlers {
  private registry: Record<string, Map<HTMLElement, any>> = {};
  private derivedHandlers: Set<any> = new Set();

  /**
   * Create a new instance of Handlers with reference to the current EventHandlers
   * @param type A class that extends DerivedEventHandlers
   * @param args Additional arguments to pass to the constructor
   */
  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    Type: any,
    ...args: U
  ): T {
    const c = Type.init(this, ...args);
    this.derivedHandlers.add(c);
    return c;
  }

  abstract handlers(): Record<
    CoreConnectorTypes,
    Partial<Omit<Handler, 'events'> & { events: any }> // (Hacky) without any, tsc throws an error
  >;

  disable() {
    Object.keys(this.registry).map((key) => {
      const registry = this.registry[key];
      registry.forEach((r) => r.disable());
    });

    this.derivedHandlers.forEach((derivedHandler) => derivedHandler.disable());
  }

  enable() {
    Object.keys(this.registry).map((key) => {
      const registry = this.registry[key];
      registry.forEach((r) => r.enable());
    });

    this.derivedHandlers.forEach((derivedHandler) => derivedHandler.enable());
  }

  cleanup() {
    this.disable();
    this.derivedHandlers = new Set();
    this.registry = {};
  }

  // Returns ref connectors for handlers
  get connectors(): Record<CoreConnectorTypes, Connector> {
    const handlers = this.handlers() || {};

    return Object.keys(handlers).reduce((accum, key) => {
      const { init, events } = handlers[key];

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
            if (init) {
              cleanup = init(el, opts);
            }
            events.forEach(([eventName, listener, capture]) => {
              el.addEventListener(eventName, listener, capture);
            });
          },
          disable: () => {
            if (cleanup) {
              cleanup();
            }
            events.forEach(([eventName, listener, capture]) =>
              el.removeEventListener(eventName, listener, capture)
            );
          },
        });

        this.registry[key].get(el).enable();
      });

      return accum;
    }, {}) as any;
  }
}

/**
 *  Allows for external packages to easily extend and derive the CoreEventHandlers
 */
export abstract class DerivedEventHandlers<
  T extends string
> extends CoreEventHandlers {
  derived: CoreEventHandlers;

  protected constructor(derived: CoreEventHandlers) {
    super();
    this.derived = derived;
  }
}

export type EventConnectors = CoreEventHandlers['connectors'];
