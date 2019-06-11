import React from "react";
import { BuilderContextState } from "~types";

const BuilderContext = React.createContext<BuilderContextState>({
  nodes: null,
  active: null,
  dragging: null,
  setCanvasNodes: () => { },
  setActive: () => { },
  setDragging: () => { }
});

export default BuilderContext;