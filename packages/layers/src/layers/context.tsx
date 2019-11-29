import React from "react";
import { NodeId } from "craftjs";
import { LayerNode } from "./LayerNode";

export type LayerContext = {
  id: NodeId,
  depth: number
};

export const LayerContext = React.createContext<LayerContext>(null);
export const LayerContextProvider: React.FC<LayerContext> = ({id, depth}) => {
  return (
    <LayerContext.Provider value={{id, depth}}>
      <LayerNode />
    </LayerContext.Provider>
  )
}