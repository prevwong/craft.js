import React from "react";
import { NodeId } from "@craftjs/core";

export type LayerContext = {
  id: NodeId,
  depth: number
};

export const LayerContext = React.createContext<LayerContext>({} as LayerContext);
