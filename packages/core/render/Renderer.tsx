import React, { useEffect, useContext } from "react";
import { mapChildrenToNodes } from "~packages/core/utils";
import { NodeElement } from "../nodes/NodeElement";
import { ManagerContext } from "../manager";
import { Canvas } from "../nodes/Canvas";

export const Renderer = ({ children }: any) => {
  const [state, methods] = useContext(ManagerContext);
  useEffect(() => {
    let node = mapChildrenToNodes(<Canvas id="rootCanvas" style={{background:"#ccc", padding:"20px 0"}}>{children}</Canvas>, null, "rootNode");
    methods.add(null, node);
    console.log("added root node");
  }, []);
  return (
    state.nodes["rootNode"] ? (
      <NodeElement id="rootNode" />
    ) : null
  )
}

