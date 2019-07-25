import React from "react";
import { LayerNode } from "./LayerNode";
import { LayerContextProvider } from "./LayerContext";

export const Layers: React.FC = () => {
  return (
    <LayerContextProvider>
      <LayerNode id="rootNode" /> 
    </LayerContextProvider>
  )
}