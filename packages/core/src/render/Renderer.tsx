import React, { useState, useMemo, useLayoutEffect } from "react";
import { NodeElement, Canvas } from "../nodes";
import { useManager } from "../connectors";
import { ROOT_NODE } from "craftjs-utils";
const invariant = require("invariant");

export const Renderer: React.FC = ({
  children
}) => {
  const { actions: { add, replaceNodes }, query: {getNode, getOptions, transformJSXToNode, deserialize } } = useManager();
  const { nodes } = getOptions();
    const [rootNode, setRootNode] = useState();
  useLayoutEffect(() => {
    if (!nodes) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Renderer /> has to be a Canvas");
      let node = transformJSXToNode(rootCanvas, {
        id: ROOT_NODE
      })
      add(node);
    } else {
      const rehydratedNodes = deserialize(nodes);
      replaceNodes(rehydratedNodes);
    }
    setRootNode(getNode('ROOT'))

  }, []);

  return useMemo(() => (
          rootNode ? (
          <NodeElement id={ROOT_NODE} />
          ) : null
  ), [rootNode])
}

