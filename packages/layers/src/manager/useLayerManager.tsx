import { useCollector } from '@craftjs/utils';
import { useContext, useRef } from 'react';

import { LayerManagerContext } from './context';

import { LayerState } from '../interfaces';

export function useLayerManager<C>(collector?: (state: LayerState) => C);
export function useLayerManager<C>(collector?: (state: LayerState) => C) {
  const { store } = useContext(LayerManagerContext);
  const collected = useCollector(store, collector);

  const { current: actions } = useRef(store.actions);

  return {
    ...collected,
    actions,
  };
}
