import { useEditor, useEventHandler } from '@craftjs/core';
import { wrapConnectorHooks } from '@craftjs/utils';
import React, { useMemo, useContext, useRef } from 'react';

import { LayerContext } from './LayerContext';
import { LayerNode } from './LayerNode';

import { LayerHandlers } from '../events/LayerHandlers';
import { LayerManagerContext } from '../manager';

export const LayerContextProvider: React.FC<Omit<
  LayerContext,
  'connectors'
>> = ({ id, depth }) => {
  const coreEventHandlers = useEventHandler();

  const { store } = useContext(LayerManagerContext);
  const storeRef = useRef(store);
  storeRef.current = store;

  const handlers = useMemo(
    () =>
      coreEventHandlers.derive(LayerHandlers, {
        layerStore: storeRef.current,
        layerId: id,
      }),
    [coreEventHandlers, id]
  );

  const connectors = useMemo(() => wrapConnectorHooks(handlers.connectors), [
    handlers,
  ]);

  const { exists } = useEditor((state) => ({
    exists: !!state.nodes[id],
  }));

  if (!exists) {
    return null;
  }

  return (
    <LayerContext.Provider value={{ id, depth, connectors }}>
      <LayerNode />
    </LayerContext.Provider>
  );
};
