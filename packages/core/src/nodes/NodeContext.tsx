import React from "react";
import { NodeId } from "../interfaces";

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
  related?: boolean;
};

export const NodeProvider: React.FC<NodeProvider> = ({
  id,
  related = false,
  children
}) => {
  return (
    <NodeContext.Provider value={{ id, related }}>
      {children}
    </NodeContext.Provider>
  );
};
