import { useMethods } from '@craftjs/utils';
import React from 'react';

import { LayerMethods } from './actions';
import { LayerManagerContext, LayerStore } from './context';

import { LayerEventContextProvider } from '../events';
import { LayerOptions } from '../interfaces';
import { DefaultLayer } from '../layers';

type LayerManagerProviderProps = {
  options: Partial<LayerOptions>;
  children?: React.ReactNode;
};

export const LayerManagerProvider = ({
  children,
  options,
}: LayerManagerProviderProps) => {
  // TODO: fix type
  const store = useMethods(LayerMethods, {
    layers: {},
    events: {
      selected: null,
      dragged: null,
      hovered: null,
    },
    options: {
      renderLayer: DefaultLayer,
      ...options,
    },
  }) as LayerStore;

  return (
    <LayerManagerContext.Provider value={{ store }}>
      <LayerEventContextProvider>{children}</LayerEventContextProvider>
    </LayerManagerContext.Provider>
  );
};
