import { Store } from '@craftjs/utils';

import { LayerMethods } from './actions';

import { LayerState } from '../interfaces';

export class LayerStore extends Store<LayerState> {
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
