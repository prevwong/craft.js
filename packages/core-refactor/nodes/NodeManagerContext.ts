import React from "react";
import { Nodes } from "~types";

export interface NodeManagerContext {
  nodes: Nodes
  add: Function,
  move: Function,
  setNodes: Function
}

export const NodeManagerContext = React.createContext<NodeManagerContext>({
  nodes: null,
  add: null,
  move: null,
  setNodes: Function
})
