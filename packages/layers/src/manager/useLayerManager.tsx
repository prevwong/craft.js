import { useCollector } from '@craftjs/utils';
import { useContext } from 'react';

import { LayerMethods } from './actions';
import { LayerManagerContext } from './context';

import { LayerState } from '../interfaces';

export function useLayerManager(): useCollector<typeof LayerMethods, null>;
export function useLayerManager<C>(
  collector?: (state: LayerState) => C
): useCollector<typeof LayerMethods, null, C>;
export function useLayerManager<C>(
  collector?: (state: LayerState) => C
): useCollector<typeof LayerMethods, null> {
  const { store } = useContext(LayerManagerContext);
  return useCollector(store, collector);
}
