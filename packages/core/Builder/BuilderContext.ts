import React from "react";
import { BuilderContextState } from "~types";

const BuilderContext = React.createContext<BuilderContextState>({
  nodes: null,
  active: null,
  dragging: null,
  placeholder: null,
  nodesInfo: {},
  setNodes: () => { },
  setActive: () => { },
  setDragging: () => { },
  setPlaceholder: () => { }
});

export default BuilderContext;