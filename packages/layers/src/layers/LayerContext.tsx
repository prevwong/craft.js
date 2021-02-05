import { NodeId } from '@craftjs/core';
import { ChainableConnectors } from '@craftjs/utils';
import React from 'react';

import { LayerHandlers } from '../events/LayerHandlers';

export type LayerContext = {
  id: NodeId;
  depth: number;
  connectors: ChainableConnectors<
    LayerHandlers['connectors'],
    React.ReactElement
  >;
};

export const LayerContext = React.createContext<LayerContext>(
  {} as LayerContext
);
