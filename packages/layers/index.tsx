import React from "react";
import { useManager } from "~packages/core/connectors";
import { LayerNode } from "./LayerNode";
import { LayerContextProvider } from "./context";

export const Layers: React.FC = () => {
  const { query } = useManager((state) => state);
  const tree = query.getTree();
  return (
    <LayerContextProvider>
      {tree ? (
        <LayerNode node={tree} />
      ) : null}
    </LayerContextProvider>
  )
}