import { wrapHookToRecognizeElement, Connector } from './wrapConnectorHooks';

// TODO(mat) any reason why why use array to store this information ?
// is there a better place for these definitions ?
export type CraftEventListener = [
  string,
  (e: Event, opts: any) => void,
  Partial<CraftEventOptions>?
];

export interface CraftEventOptions {
  capture: boolean;
  blocking: boolean;
}

export const defineEventListener = (
  name: string,
  handler: (e: MouseEvent, payload: any) => void,
  options?: Partial<CraftEventOptions>
): CraftEventListener => [name, handler, options];

export type Handler = {
  /**
   * The DOM manipulations to perform on the attached DOM element
   * @returns function that reverts the DOM manipulations performed
   */
  init: (el: HTMLElement, opts: any) => any;

  /**
   * List of Event Listeners to add to the attached DOM element
   */
  events: readonly CraftEventListener[];
};

export type ConnectorsForHandlers<T extends Handlers> = ReturnType<
  T['connectors']
>;

/**
 * Attaches/detaches a Handler to a DOM element
 * The handler is attached/detached depending on the enabled state from the `store`
 */
class WatchHandler {
  el: HTMLElement;
  opts: any;

  private handler: Handler;
  private unsubscribe: () => void;
  private cleanDOM: void | (() => void);
  private listenersToRemove: (() => void)[];

  constructor(store, el: HTMLElement, opts: any, handler: Handler) {
    this.el = el;
    this.opts = opts;
    this.handler = handler;

    this.unsubscribe = store.subscribe(
      (state) => ({ enabled: state.options.enabled }),
      ({ enabled }) => {
        if (!document.body.contains(el)) {
          this.remove();
          return this.unsubscribe();
        }

        if (enabled) {
          this.add();
        } else {
          this.remove();
        }
      },
      true
    );
  }

  private add() {
    const { init, events } = this.handler;

    this.cleanDOM = init && init(this.el, this.opts);
    this.listenersToRemove =
      events &&
      events.map(([eventName, listener, options = {}]) => {
        const bindedListener = (e) => {
          if (e.craft !== 'handled') {
            listener(e, this.opts);
            if (options.blocking) {
              e.craft = 'handled';
            }
          }
        };

        this.el.addEventListener(eventName, bindedListener, options.capture);
        return () =>
          this.el.removeEventListener(
            eventName,
            bindedListener,
            options.capture
          );
      });
  }

  remove() {
    if (this.cleanDOM) {
      this.cleanDOM();
      this.cleanDOM = null;
    }

    if (this.listenersToRemove) {
      this.listenersToRemove.forEach((l) => l());
      this.listenersToRemove = null;
    }
  }
}

/**
 * Creates Event Handlers
 */
export abstract class Handlers<T extends string = null> {
  // Stores a map of DOM elements to their attached connector's WatchHandler
  private static wm = new WeakMap<HTMLElement, Record<string, WatchHandler>>();
  // Data store to infer the enabled state from
  protected store;

  constructor(store) {
    this.store = store;
  }

  abstract handlers(): Record<
    T,
    Partial<Omit<Handler, 'events'> & { events: any }> // (Hacky) without any, tsc throws an error
  >;

  // Returns ref connectors for handlers
  connectors(): Record<T, Connector> {
    const initialHandlers = this.handlers() || {};

    return Object.keys(initialHandlers).reduce((accum, key) => {
      const { init, events } = initialHandlers[key];

      if (!init && !events) {
        accum[key] = () => {};
        return accum;
      }

      const connector = (el, opts) => {
        if (!document.body.contains(el)) {
          Handlers.wm.delete(el);
        }

        const domHandler = Handlers.wm.get(el);
        if (domHandler && domHandler[key]) {
          domHandler[key].remove();
        }

        Handlers.wm.set(el, {
          ...domHandler,
          [key]: new WatchHandler(this.store, el, opts, {
            init,
            events,
          }),
        });
      };

      accum[key] = wrapHookToRecognizeElement(connector);
      return accum;
    }, {}) as any;
  }

  static getConnectors<T extends Handlers, U extends any[]>(
    this: { new (...args: U): T },
    ...args: U
  ): ReturnType<T['connectors']> {
    const that = new this(...args);
    return that.connectors() as any;
  }
}
