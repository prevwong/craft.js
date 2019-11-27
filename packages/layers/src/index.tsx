import React from "react";
import { LayerNode } from "./LayerNode";
import { LayerContextProvider } from "./LayerContext";
import { ROOT_NODE } from 'craftjs-utils';
import { LayerOptions } from "./interfaces";

export const Layers: React.FC<Partial<LayerOptions>> = ({...options}) => {
  return (
    <LayerContextProvider options={options}>
      <LayerNode id={ROOT_NODE} /> 
    </LayerContextProvider>
  )
}

