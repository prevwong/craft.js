import React, { useEffect, useContext, useMemo } from "react";
import { NodeElement, Canvas, mapChildrenToNodes } from "../nodes";
import { ManagerContext, useManager } from "../manager";
import { RenderContext, RenderContextProvider } from "./RenderContext";
import { ReactElement, NodeId } from "~types";
import { NodeData, Nodes, SerializedNodeData } from "../interfaces";
import { deserializeNode } from "../shared/deserializeNode";
import { createNode } from "../shared/createNode";
const invariant = require("invariant");

export type Renderer = {
  nodes?: Record<NodeId, SerializedNodeData>
  resolvers?: Function
} & RenderContext

export const Renderer: React.FC<Renderer> = ({ 
  children, 
  onRender = ({render}) => render,
  resolvers = () => {},
  nodes = null 
}) => {
  const {rootNode, add, replaceNodes} = useManager((state) => ({rootNode: state.nodes["rootNode"]}));
  useEffect(() => {
    if ( !nodes ) { 
      const rootCanvas = React.Children.only(children) as ReactElement;
      invariant(rootCanvas.type  && rootCanvas.type == Canvas, "The immediate child of <Renderer /> has to be a Canvas");
      let node = mapChildrenToNodes(rootCanvas, null, "rootNode");
      add(null, node);
    } else {
      const rehydratedNodes = Object.keys(nodes).reduce((accum, id) => {
        const {type, props, parent, closestParent, nodes: childNodes} = deserializeNode(nodes[id], resolvers);
        // TODO: Refactor createNode()
        accum[id] = createNode({
          type,
          props,
          parent, 
          closestParent,
          nodes: childNodes
        }, id);

        return accum;
      }, {} as Nodes);
      replaceNodes(rehydratedNodes);
    }
  }, []);

  return useMemo(() => (
    <RenderContextProvider onRender={onRender}>
     {
        rootNode ? (
          <NodeElement id="rootNode" />
        ) : null
     }
    </RenderContextProvider>
  ), [rootNode])
}

