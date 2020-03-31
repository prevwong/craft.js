import React from "react";
import { NodeId } from "../interfaces";
import { NodeConnectors } from "./NodeHandlers";

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
  related?: boolean;
  connectors?: NodeConnectors;
};

export const NodeProvider: React.FC<NodeProvider> = ({
  id,
  related = false,
  connectors,
  children,
}) => {
  return (
    <NodeContext.Provider value={{ id, related, connectors }}>
      {children}
    </NodeContext.Provider>
  );
};
