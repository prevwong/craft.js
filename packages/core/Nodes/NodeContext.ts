
import React from "react";
import { NodeContextState } from "~types";


const NodeContext = React.createContext<NodeContextState>({
  node: null,
  pushChildCanvas: () => { },
  builder: null,
  childCanvas: null
});

export default NodeContext;