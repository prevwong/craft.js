
import React from "react";
import { NodeContextState } from "~types";


const NodeContext = React.createContext<NodeContextState>({
  node: null,
  builder: null,
  nodeState: {}
});

export default NodeContext;