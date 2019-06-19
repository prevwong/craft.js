import React from "react";
import { LayerContextState } from "./types";

const LayerContext = React.createContext<LayerContextState>({
  builder: null,
  dragging: null,
  layersCollapsed: null,
  setDragging: () => {},
  setLayerCollapse: () => {},
  layerInfo: {},
  placeholder: null
});

export default LayerContext;