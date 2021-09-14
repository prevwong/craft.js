import { useEventHandler } from '@craftjs/core';
import React, { useMemo } from 'react';

import { LayerEventHandlerContext } from './LayerEventContext';
import { LayerHandlers } from './LayerHandlers';
import { RenderLayerIndicator } from './RenderLayerIndicator';

import { useLayerManager } from '../manager';

export const LayerEventContextProvider = ({ children }) => {
  const { store: layerStore } = useLayerManager();
  const coreEventHandler = useEventHandler();

  const handler = useMemo(
    () =>
      coreEventHandler.derive(LayerHandlers, {
        layerStore,
      }),
    [coreEventHandler, layerStore]
  );

  return (
    <LayerEventHandlerContext.Provider value={handler}>
      <RenderLayerIndicator />
      {children}
    </LayerEventHandlerContext.Provider>
  );
};
