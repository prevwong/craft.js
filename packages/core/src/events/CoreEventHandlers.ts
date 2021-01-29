import { Handlers } from '@craftjs/utils';

import { EditorStore } from '../editor';

type CoreConnectorTypes =
  | 'select'
  | 'hover'
  | 'drag'
  | 'drop'
  | 'create'
  | 'connect';

export abstract class CoreEventHandlers extends Handlers {
  store: EditorStore;
  constructor(store: EditorStore) {
    super();
    this.store = store;
  }

  abstract handlers(): Record<
    CoreConnectorTypes,
    (el: HTMLElement, ...args: any[]) => any
  >;
}
