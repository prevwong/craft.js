import React from "react";
import { NodeId } from "@craftjs/core";
import { LayerConnectors } from "events/LayerHandlers";

export type LayerContext = {
  id: NodeId;
  depth: number;
  connectors: LayerConnectors;
};

export const LayerContext = React.createContext<LayerContext>(
  {} as LayerContext
);
