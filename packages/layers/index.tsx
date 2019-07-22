import React from "react";
import { useManager } from "~packages/core/connectors";
import { LayerNode } from "./LayerNode";
import { LayerContextProvider } from "./LayerContext";

export const Layers: React.FC = () => {
  return (
    <LayerContextProvider>
      <LayerNode id="rootNode" /> 
    </LayerContextProvider>
  )
}