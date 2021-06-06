import { createContext } from 'react';

import { LayerStore } from './LayerStore';

export type LayerManagerContext = {
  store: LayerStore;
};

export const LayerManagerContext = createContext<LayerManagerContext>(
  {} as LayerManagerContext
);
