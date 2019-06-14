import React from "react";
import { BuilderContextState } from "~types";

const BuilderContext = React.createContext<BuilderContextState>({
  nodes: null,
  active: null,
  hover:null,
  dragging: null,
  placeholder: null,
  nodesInfo: {},
  setNodes: () => { },
  setActive: () => { },
  setHover: () => { },
  setDragging: () => { },
  setPlaceholder: () => { }
});

export default BuilderContext;