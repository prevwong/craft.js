import React from "react";
import { CanvasNodes, Nodes } from "~types";

export interface BuilderContextState {
  nodes: Nodes,
  canvases: CanvasNodes,
  active: Node,
  dragging: Node,
  setCanvasNodes: Function
  setActive: Function
  setDragging: Function
}

export const BuilderContext = React.createContext<BuilderContextState>({
  canvases: null,
  nodes: null,
  active: null,
  dragging: null,
  setCanvasNodes: () => { },
  setActive: () => { },
  setDragging: () => { }
});
