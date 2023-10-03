import { createContext } from 'react';

import { LayerStore } from './LayerStore';

export type LayerManagerContextType = {
  store: LayerStore;
};

export const LayerManagerContext = createContext<LayerManagerContextType>(
  {} as LayerManagerContextType
);
