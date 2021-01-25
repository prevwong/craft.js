import { EditorStore } from '../editor';
import { Handlers } from './Handlers';

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
}
