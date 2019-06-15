
import React from "react";
import { NodeContextState, NodeCanvasContextState } from "~types";

export default React.createContext<NodeCanvasContextState>({
  pushChildCanvas: () => {},
  childCanvas: null,
  builder: null,
  node: null,
  state: null
});
