import { useEditor } from '@craftjs/core';
import { wrapConnectorHooks } from '@craftjs/utils';
import React, { useMemo, useContext, useRef, useEffect } from 'react';

import { LayerContext } from './LayerContext';
import { LayerNode } from './LayerNode';

import { useLayerEventHandler } from '../events/LayerEventContext';
import { LayerManagerContext } from '../manager';

export const LayerContextProvider: React.FC<Omit<
  LayerContext,
  'connectors'
>> = ({ id, depth }) => {
  const handlers = useLayerEventHandler();

  const { store } = useContext(LayerManagerContext);
  const storeRef = useRef(store);
  storeRef.current = store;

  const connectorInstance = useMemo(() => handlers.createConnectorInstance(), [
    handlers,
  ]);

  const connectors = useMemo(
    () => wrapConnectorHooks(connectorInstance.connectors),
    [connectorInstance]
  );

  useEffect(() => {
    return () => {
      connectorInstance.cleanup();
    };
  }, [connectorInstance]);

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
