import React, { useEffect } from "react";
import { NodeId } from "../interfaces";

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
  related?: boolean;
  connectors?: any;
};

export const NodeProvider: React.FC<NodeProvider> = ({
  id,
  related = false,
  connectors,
  children
}) => {
  return (
    <NodeContext.Provider value={{ id, related, connectors }}>
      {children}
    </NodeContext.Provider>
  );
};
