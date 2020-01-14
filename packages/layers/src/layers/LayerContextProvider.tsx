import * as React from "react";
import { LayerContext } from "./LayerContext";
import { LayerNode } from "./LayerNode";

export const LayerContextProvider: React.FC<LayerContext> = ({ id, depth }) => {
  return (
    <LayerContext.Provider value={{ id, depth }}>
      <LayerNode />
    </LayerContext.Provider>
  );
};
