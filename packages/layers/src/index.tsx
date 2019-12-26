import React from "react";
import { LayerContextProvider } from "./layers";
import { LayerManagerContextProvider } from "./manager";
import { ROOT_NODE } from '@craftjs/utils';
import { LayerOptions } from "./interfaces";

export const Layers: React.FC<Partial<LayerOptions>> = ({...options}) => {
  return (
    <LayerManagerContextProvider options={options}>
      <LayerContextProvider id={ROOT_NODE} depth={0} />
    </LayerManagerContextProvider>
  )
}


