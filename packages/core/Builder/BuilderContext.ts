import React from "react";
import { BuilderContextState } from "~types";

const BuilderContext = React.createContext<BuilderContextState>({
  nodes: null,
  nodeStates: null,
  active: null,
  hover:null,
  dragging: null,
  placeholder: null,
  nodesInfo: {},
  setNodes: () => { },
  setNodeState: () => { },
  setPlaceholder: () => { }
});

export default BuilderContext;