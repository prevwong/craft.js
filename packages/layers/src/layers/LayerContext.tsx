import { NodeId } from '@craftjs/core';
import { EventHandlerConnectors } from '@craftjs/utils';
import React from 'react';

import { LayerHandlers } from '../events/LayerHandlers';

export type LayerContext = {
  id: NodeId;
  depth: number;
  connectors: EventHandlerConnectors<LayerHandlers, React.ReactElement>;
};

export const LayerContext = React.createContext<LayerContext>(
  {} as LayerContext
);
