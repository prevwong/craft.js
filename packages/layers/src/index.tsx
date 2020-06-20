import React from "react";
import { LayerContextProvider } from "./layers/LayerContextProvider";
import { LayerManagerProvider } from "./manager/LayerManagerProvider";
import { ROOT_NODE } from "@craftjs/utils";
import { LayerOptions } from "./interfaces";
export { useLayer } from "./layers";

export const Layers: React.FC<Partial<LayerOptions>> = ({ ...options }) => {
  return (
    <LayerManagerProvider options={options}>
      <LayerContextProvider id={ROOT_NODE} depth={0} />
    </LayerManagerProvider>
  );
};
