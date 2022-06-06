import React from 'react';

import { NodeId } from '../interfaces';

export type NodeContextType = {
  id: NodeId;
  related?: boolean;
};

export const NodeContext = React.createContext<NodeContextType>(null);

export type NodeProviderProps = Omit<NodeContextType, 'connectors'>;

export const NodeProvider: React.FC<React.PropsWithChildren<
  NodeProviderProps
>> = ({ id, related = false, children }) => {
  return (
    <NodeContext.Provider value={{ id, related }}>
      {children}
    </NodeContext.Provider>
  );
};
