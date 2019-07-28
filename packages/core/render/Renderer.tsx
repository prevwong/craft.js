import React, { useMemo, useContext, useLayoutEffect } from "react";
import { NodeElement, Canvas } from "../nodes";
import DNDManager from "../dnd";
import { useManager } from "../connectors";
import { RootContext } from "../root/RootContext";
import { ROOT_NODE } from "~packages/shared/constants";
const invariant = require("invariant");

export const Renderer: React.FC = ({
  children
}) => {
  const manager = useContext(RootContext);
  const { rootNode, actions: { add, replaceNodes }, query: { getOptions, transformJSXToNode, deserialize } } = useManager((state) => ({ rootNode: state.nodes[ROOT_NODE]}));
  const { nodes, resolver } = getOptions();
  useLayoutEffect(() => {
    if (!nodes) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Renderer /> has to be a Canvas");
      let node = transformJSXToNode(rootCanvas, {
        id: ROOT_NODE
      })
      add(node);
    } else {
      const rehydratedNodes = deserialize(nodes, resolver);
      replaceNodes(rehydratedNodes);
    }
  }, []);

  return useMemo(() => (
      <DNDManager>
        {
          rootNode ? (
          <NodeElement id={ROOT_NODE} />
          ) : null
        }
      </DNDManager>
  ), [rootNode])
}

