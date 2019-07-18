import React from "react";
import { useManager } from "~packages/core/connectors";
import { LayerNode } from "./LayerNode";

export const Layers: React.FC = () => {
  const {query} = useManager((state) => state);
  const tree = query.getTree();

  return (
    tree ? (
      <LayerNode node={tree} />
    ) : null
  )
}