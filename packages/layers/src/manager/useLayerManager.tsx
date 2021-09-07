import { useCollector } from '@craftjs/utils';
import { useContext, useMemo } from 'react';

import { LayerManagerContext } from './context';

import { LayerState } from '../interfaces';

export function useLayerManager<C>(collector?: (state: LayerState) => C) {
  const { store } = useContext(LayerManagerContext);
  const collected = useCollector(store, collector);

  return useMemo(
    () => ({
      store,
      ...collected,
    }),
    [store, collected]
  );
}
