
import React from "react";
import { NodeContextState, NodeCanvasContextState, CanvasMapping } from "~types";
import { NodeContext } from "./NodeContext";

export interface  NodeCanvasContext extends NodeContext {
  pushChildCanvas: Function,
  childCanvas: CanvasMapping
}

export const NodeCanvasContext = React.createContext<NodeCanvasContext>({
  pushChildCanvas: () => {},
  childCanvas: null,
  api: null,
  node: null,
  events: null
});
