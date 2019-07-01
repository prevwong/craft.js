import React from "react";
import { LayerContextState } from "./types";

const LayerNodeContext = React.createContext<any>({
  collapsed: false
});

export default LayerNodeContext;