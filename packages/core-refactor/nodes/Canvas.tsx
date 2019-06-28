import React, { useEffect } from "react";
import { connectInternalNode } from "./NodeContext";
import { mapChildrenToNodes, createNode } from "~packages/core/utils";
import { CanvasNode, NodeId, Node } from "~types";
import { NodeElement } from "./NodeElement";
import {  RenderNodeToElement } from "../render/RenderNode";
const shortid = require("shortid");

export interface Canvas {
  id: NodeId,
  node: Node,
  manager: any
}

const Canvas : React.FC<Canvas> = connectInternalNode(({ id, children, node, manager }) => {
  const internal = React.useRef({ id: null })
  useEffect(() => {
    let canvasId = `canvas-${shortid.generate()}`;
    if (node.type === Canvas) {
      canvasId = internal.current.id = node.id;
      const childNodes = mapChildrenToNodes(children, canvasId);
      manager.add(node.id, childNodes);
    } else {
      if (!id) throw new Error("Root Canvas cannot ommit `id` prop");
      // const rootNode = createNode(this.constructor as React.ElementType, this.props, canvasId, null);
      if (!node.childCanvas || (node.childCanvas && !node.childCanvas[id])) {
        const rootNode = createNode(Canvas, { children }, canvasId, null);
        internal.current.id = canvasId;
        manager.pushChildCanvas(node.id, id, rootNode);
      }
    }
  }, []);

  return (
    node.type === Canvas ? (
      <RenderNodeToElement is="div" className="hi-canvas">
        <React.Fragment>
          {
            (node as CanvasNode).nodes && (node as CanvasNode).nodes.map((id => (
              <NodeElement id={id} key={id} />
            )))
          }
        </React.Fragment>
      </RenderNodeToElement>
    ) : (
        internal.current.id ? (
          <NodeElement id={internal.current.id} />
        ) : null
      )
  )
})

