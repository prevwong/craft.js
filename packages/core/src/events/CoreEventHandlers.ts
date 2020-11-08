import { EditorStore } from '../editor/store';
import { ConnectorsForHandlers, Handlers } from '../utils/Handlers';

/**
 * Craft's core event handlers
 * Connectors are created from the handlers defined here
 */
export abstract class CoreEventHandlers extends Handlers<
  'select' | 'hover' | 'drag' | 'drop' | 'create'
> {
  /**
   * Create a new instance of Handlers with reference to the current EventHandlers
   * @param type A class that extends DerivedEventHandlers
   * @param args Additional arguments to pass to the constructor
   */
  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    type: {
      new (store: EditorStore, derived: CoreEventHandlers, ...args: U): T;
    },
    ...args: U
  ): T {
    return new type(this.store, this, ...args);
  }
}

/**
 *  Allows for external packages to easily extend and derive the CoreEventHandlers
 */
export abstract class DerivedEventHandlers<T extends string> extends Handlers<
  T
> {
  derived: CoreEventHandlers;

  protected constructor(store: EditorStore, derived: CoreEventHandlers) {
    super(store);
    this.derived = derived;
  }
}

export type EventConnectors = ConnectorsForHandlers<CoreEventHandlers>;
