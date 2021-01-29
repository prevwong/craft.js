import { DerivedEventHandlers, EventHandlers } from '@craftjs/utils';

import { EditorStore } from '../editor';

type CoreConnectorTypes =
  | 'select'
  | 'hover'
  | 'drag'
  | 'drop'
  | 'create'
  | 'connect';

export abstract class CoreEventHandlers<O = {}> extends EventHandlers<
  { store: EditorStore } & O
> {
  abstract handlers(): Record<
    CoreConnectorTypes,
    (el: HTMLElement, ...args: any[]) => any
  >;
}

export abstract class DerivedCoreEventHandlers<
  O = {}
> extends DerivedEventHandlers<CoreEventHandlers, O> {}

export type CoreEventConnectors = CoreEventHandlers['connectors'];
