import { wrapHookToRecognizeElement, Connector } from '@craftjs/utils';

import { EditorStore } from '../editor/store';

export type CraftDOMEvent<T extends Event> = T & {
  craft: {
    stopPropagation: () => void;
    blockedEvents: Record<string, boolean>;
  };
};

export type CraftEventListener = [
  string,
  (e: CraftDOMEvent<Event>, opts: any) => void,
  boolean
];

export const defineEventListener = (
  name: string,
  handler: (e: CraftDOMEvent<Event>, payload: any) => void,
  capture?: boolean
): CraftEventListener => [name, handler, capture];

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
 * Check if a specified event is blocked by a child
 * that's a descendant of the specified element
 */
const isEventBlockedByDescendant = (e, eventName, el) => {
  // TODO: Update TS to use optional chaining
  const blockingElements = (e.craft && e.craft.blockedEvents[eventName]) || [];

  for (let i = 0; i < blockingElements.length; i++) {
    const blockingElement = blockingElements[i];

    if (el !== blockingElement && el.contains(blockingElement)) {
      return true;
    }
  }

  return false;
};

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
      events.map(([eventName, listener, capture]) => {
        const bindedListener = (e) => {
          // Store initial Craft event value
          if (!e.craft) {
            e.craft = {
              blockedEvents: {},
              stopPropagation: () => {},
            };
          }

          if (!isEventBlockedByDescendant(e, eventName, this.el)) {
            e.craft.stopPropagation = () => {
              if (!e.craft.blockedEvents[eventName]) {
                e.craft.blockedEvents[eventName] = [];
              }

              e.craft.blockedEvents[eventName].push(this.el);
            };

            listener(e, this.opts);
          }
        };

        this.el.addEventListener(eventName, bindedListener, capture);

        return () =>
          this.el.removeEventListener(eventName, bindedListener, capture);
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
  private wm = new WeakMap<HTMLElement, Record<string, WatchHandler>>();
  // Data store to infer the enabled state from
  protected store: EditorStore;

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
        if (!el || !document.body.contains(el)) {
          this.wm.delete(el);
          return;
        }

        const domHandler = this.wm.get(el);

        if (domHandler && domHandler[key]) {
          return;
        }

        this.wm.set(el, {
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
