import React, { useState, useMemo, useLayoutEffect, useCallback } from "react";
import { NodeElement, Canvas } from "../nodes";
import { useManager } from "../connectors";
import DNDManager from "../dnd";

import { ROOT_NODE } from "craftjs-utils";
const invariant = require("invariant");

export type Renderer = {
  is: string
} & any;

export const Renderer: React.FC<Renderer> = ({
  is,
  children,
  ...props
}) => {
  const { actions: { add, replaceNodes, setNodeEvent }, query: {getNode, getOptions, transformJSXToNode, deserialize } } = useManager();
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
            React.createElement(is, {
              onMouseDown: () => {
                setNodeEvent("active", null)
              },
              onMouseOver: () => {
                setNodeEvent("hover", null)
              },
              ...props
            }, <DNDManager><NodeElement id={ROOT_NODE} /></DNDManager> )
          ) : null
  ), [rootNode])
}

