import React, { useMemo } from 'react';

import { LayerStore } from './LayerStore';
import { LayerManagerContext } from './context';

import { EventManager } from '../events';
import { LayerOptions } from '../interfaces';
import { DefaultLayer } from '../layers';

export const LayerManagerProvider: React.FC<{
  options: Partial<LayerOptions>;
}> = ({ children, options }) => {
  const store = useMemo(
    () =>
      new LayerStore({
        layers: {},
        events: {
          selected: null,
          hovered: null,
          indicator: null,
        },
        options: {
          expandRootOnLoad: true,
          renderLayer: DefaultLayer,
          ...options,
        },
      }),
    [options]
  );

  return (
    <LayerManagerContext.Provider value={{ store }}>
      <EventManager>{children}</EventManager>
    </LayerManagerContext.Provider>
  );
};
