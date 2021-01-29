import { NodeId } from '@craftjs/core';
import React from 'react';

import { LayerEventConnectors } from '../events/LayerHandlers';

export type LayerContext = {
  id: NodeId;
  depth: number;
  connectors: LayerEventConnectors;
};

export const LayerContext = React.createContext<LayerContext>(
  {} as LayerContext
);
