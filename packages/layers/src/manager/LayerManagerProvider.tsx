import { useMethods } from '@craftjs/utils';
import React from 'react';

import { LayerMethods } from './actions';
import { LayerManagerContext } from './context';

import { EventManager } from '../events';
import { LayerOptions } from '../interfaces';
import { DefaultLayer } from '../layers';

export const LayerManagerProvider: React.FC<{
  options: Partial<LayerOptions>;
}> = ({ children, options }) => {
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
  });

  return (
    <LayerManagerContext.Provider value={{ store }}>
      <EventManager>{children}</EventManager>
    </LayerManagerContext.Provider>
  );
};
