import { EditorStore } from '@craftjs/core';
import { Store } from '@craftjs/utils';

import { LayerMethods } from './actions';

import { LayerHandlers } from '../events/LayerHandlers';
import { LayerState } from '../interfaces';

export class LayerStore extends Store<LayerState> {
  handlers: LayerHandlers;
  constructor(initialState: LayerState, editorStore: EditorStore) {
    super(initialState);

    this.handlers = new LayerHandlers(editorStore.handlers, {
      layerStore: this,
    });
  }

  get actions() {
    const methods = LayerMethods(null);
    return Object.keys(methods).reduce((accum, actionKey) => {
      return {
        ...accum,
        [actionKey]: (...args) =>
          this.setState((state) => LayerMethods(state)[actionKey](...args)),
      };
    }, {} as ReturnType<typeof LayerMethods>);
  }
}
