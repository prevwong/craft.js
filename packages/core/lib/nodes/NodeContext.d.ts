import React from 'react';
import { NodeId } from '../interfaces';
export declare type NodeContextType = {
  id: NodeId;
  related?: boolean;
};
export declare const NodeContext: React.Context<NodeContextType>;
export declare type NodeProviderProps = Omit<NodeContextType, 'connectors'>;
export declare const NodeProvider: React.FC<NodeProviderProps>;
