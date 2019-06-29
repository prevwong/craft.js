import React, { useEffect } from "react";
import { connectInternalNode, ConnectedNode } from "./NodeContext";
import { mapChildrenToNodes, createNode } from "~packages/core-refactor/utils/index.tsx";
import { CanvasNode, NodeId, Node } from "~types";
import { NodeElement } from "./NodeElement";
import { RenderNodeToElement } from "../render/RenderNode";
import { ManagerMethods } from "../manager/methods";
const shortid = require("shortid");

export interface Canvas extends ConnectedNode<ManagerMethods> {
  id?: NodeId,
  children?: React.ReactNode
}

export const Canvas = connectInternalNode(({ node, manager, children, id }: Canvas) => {
  const internal = React.useRef({ id: null });
  useEffect(() => {
    console.log("canvas effe")
    let canvasId = `canvas-${shortid.generate()}`;

    if (node.type === Canvas) {
      canvasId = internal.current.id = node.id;
      const childNodes = mapChildrenToNodes(children, canvasId);
      manager.add(node.id, childNodes);
    } else {
      if (!id) throw new Error("Root Canvas cannot ommit `id` prop");
      // const rootNode = createNode(this.constructor as React.ElementType, this.props, canvasId, null);
      if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
        const rootNode = createNode(Canvas, { children }, canvasId, null);
        internal.current.id = canvasId;
        manager.pushChildCanvas(node.id, id, rootNode);
      }
    }
  }, []);

  console.log(node, node.type === Canvas, internal.current.id)
  return (
    node.type === Canvas ? (
      <RenderNodeToElement is="div" className="hi-canvas">
        {
          <React.Fragment>
            (node as CanvasNode).nodes && (node as CanvasNode).nodes.map((id => (
                <NodeElement id={id} key={id} />
            )))
              </React.Fragment>
        }
      </RenderNodeToElement>
    ) : (
        internal.current.id ? (
          <NodeElement id={internal.current.id} />
        ) : null
      )
  )
});


