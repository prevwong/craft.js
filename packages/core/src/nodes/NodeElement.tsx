import React, { useMemo } from "react";
import { NodeProvider } from "./NodeContext";
import { RenderNodeToElement } from "../render/RenderNode";
import { NodeId } from "../interfaces";
import { NodeHandlers } from "./NodeHandlers";
import { useEventHandler } from "../events";

export type NodeElement = {
  id: NodeId;
};

export const NodeElement: React.FC<NodeElement> = React.memo(({ id }) => {
  const handlers = useEventHandler();

  const connectors = useMemo(
    () => handlers.derive(NodeHandlers, id).connectors(),
    [handlers, id]
  );

  return (
    <NodeProvider id={id} connectors={connectors}>
      <RenderNodeToElement />
    </NodeProvider>
  );
});
