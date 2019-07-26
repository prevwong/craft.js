import React from "react";
import { LayerNode } from "./LayerNode";
import { LayerContextProvider } from "./LayerContext";
import { ROOT_NODE } from '~packages/shared/constants';

export const Layers: React.FC = () => {
  return (
    <LayerContextProvider>
      <LayerNode id={ROOT_NODE} /> 
    </LayerContextProvider>
  )
}