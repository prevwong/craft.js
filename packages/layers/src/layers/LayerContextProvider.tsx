import { useEditor, useEventHandler } from '@craftjs/core';
import React, { useMemo, useContext } from 'react';

import { LayerContext } from './LayerContext';
import { LayerNode } from './LayerNode';

import { LayerHandlers } from '../events/LayerHandlers';
import { LayerManagerContext } from '../manager';

export const LayerContextProvider: React.FC<Omit<
  LayerContext,
  'connectors'
>> = ({ id, depth }) => {
  const handler = useEventHandler();

  const { store } = useContext(LayerManagerContext);
  const connectors = useMemo(
    () => handler.derive(LayerHandlers, store, id).connectors(),
    [handler, id, store]
  );

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
