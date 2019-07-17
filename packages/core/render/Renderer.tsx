import React, { useEffect, useMemo, useContext } from "react";
import { NodeElement, Canvas, mapChildrenToNodes } from "../nodes";
import DNDManager from "../dnd";
import { RootContext } from "../RootContext";
import { useManager } from "../connectors";
const invariant = require("invariant");

export const Renderer: React.FC = ({
  children
}) => {
  const { options:{nodes, resolver, onRender, renderPlaceholder }} = useContext(RootContext);
  const { rootNode, actions: { add, replaceNodes }, query: {deserialize} } = useManager((state) => ({rootNode: state.nodes["rootNode"]}));
  useEffect(() => {
    if (!nodes) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Renderer /> has to be a Canvas");
      let node = mapChildrenToNodes(rootCanvas, null, "rootNode");
      add(null, node);
    } else {
      const rehydratedNodes = deserialize(nodes, resolver);
      replaceNodes(rehydratedNodes);
    }
  }, []);

  return useMemo(() => (
      <DNDManager>
        {
          rootNode ? (
            <NodeElement id="rootNode" />
          ) : null
        }
      </DNDManager>
  ), [rootNode])
}

