import { useCollector, useCollectorReturnType } from '@craftjs/utils';
import { useContext } from 'react';

import { LayerManagerContext, LayerStore } from './context';

import { LayerState } from '../interfaces';

export function useLayerManager(): useCollectorReturnType<LayerStore>;
export function useLayerManager<C>(
  collector?: (state: LayerState) => C
): useCollectorReturnType<LayerStore, C>;
export function useLayerManager<C>(
  collector?: (state: LayerState) => C
): useCollectorReturnType<LayerStore> {
  const { store } = useContext(LayerManagerContext);
  return useCollector(store, collector);
}
