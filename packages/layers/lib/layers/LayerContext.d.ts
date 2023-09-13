import { NodeId } from '@craftjs/core';
import { EventHandlerConnectors } from 'craftjs-utils-meetovo';
import React from 'react';
import { LayerHandlers } from '../events/LayerHandlers';
export declare type LayerContext = {
    id: NodeId;
    depth: number;
    connectors: EventHandlerConnectors<LayerHandlers, React.ReactElement>;
};
export declare const LayerContext: React.Context<LayerContext>;
