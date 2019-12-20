import React, { useState, useMemo, useEffect } from "react";
import { NodeElement, Canvas } from "../nodes";
import { ROOT_NODE } from "craftjs-utils";
import { useInternalEditor } from "../editor/useInternalEditor";

const invariant = require("invariant");

export type Frame = {
  nodes: String
} & any;

export const Frame: React.FC<Frame> = ({
  children,
  nodes,
  ...props
}) => {
  const { actions: { add, replaceNodes, setNodeEvent }, query: {getNode, getOptions, createNode, deserialize } } = useInternalEditor();
  // const { nodes } = getOptions();
  const [rootNode, setRootNode] = useState();
  
  
  
  useEffect(() => {
    if (!nodes) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Frame /> has to be a Canvas");
      let node = createNode(rootCanvas, {
        id: ROOT_NODE
      })
      add(node);
    } else {
      const rehydratedNodes = deserialize(nodes);
      replaceNodes(rehydratedNodes);
    }
    setRootNode(getNode(ROOT_NODE))
  }, []);


  return useMemo(() => {
    return (
      <>
        {
          rootNode ? (
            <NodeElement id={ROOT_NODE} />
          ) : null
        }
      </>
    )
  }, [rootNode])
}

