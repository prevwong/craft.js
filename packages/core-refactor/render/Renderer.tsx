import React, { useEffect, useContext } from "react";
import { Canvas } from "../nodes/Canvas";
import { mapChildrenToNodes } from "~packages/core/utils";
import { NodeElement } from "../nodes/NodeElement";
import { ManagerContext } from "../manager";

export const Renderer = ({ children }: any) => {
  const { state, methods } = useContext(ManagerContext);
  useEffect(() => {
    let node = mapChildrenToNodes(<Canvas id="rootCanvas">{children}</Canvas>, null, "rootNode");
    methods.add(null, node);
  }, []);
  return (
    state.nodes["rootNode"] ? (
      <NodeElement id="rootNode" />
    ) : null
  )
}

