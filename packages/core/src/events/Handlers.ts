import { wrapHookToRecognizeElement, Connector } from '@craftjs/utils';

import { EditorStore } from '../editor/store';
import { CraftEventListener } from '../interfaces';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';

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
 * Creates Event Handlers
 */
export abstract class Handlers<T extends string = null> {
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

      const connector = (el, opts) => {};

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
