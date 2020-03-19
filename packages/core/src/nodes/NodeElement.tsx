import React, { useEffect, useMemo } from "react";
import { NodeProvider } from "./NodeContext";
import { RenderNodeToElement } from "../render/RenderNode";
import { NodeId } from "../interfaces";
import { NodeHandlers } from "../hooks/NodeHandlers";
import { useInternalEditor } from "../editor/useInternalEditor";

export type NodeElement = {
  id: NodeId;
};

export const NodeElement: React.FC<NodeElement> = React.memo(({ id }) => {
  const { store, connectors: editorConnectors } = useInternalEditor();

  const connectors = useMemo(
    () => NodeHandlers.create(store, id, editorConnectors),
    [editorConnectors, id, store]
  );

  return (
    <NodeProvider id={id} connectors={connectors}>
      <RenderNodeToElement />
    </NodeProvider>
  );
});
