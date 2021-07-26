import { useCollector } from '@craftjs/utils';
import { useContext } from 'react';

import { LayerManagerContext } from './context';

import { LayerState } from '../interfaces';

export function useLayerManager<C>(collector?: (state: LayerState) => C) {
  const { store } = useContext(LayerManagerContext);
  return useCollector(store, collector);
}
