import React, { useEffect } from "react";
import { mapChildrenToNodes, createNode } from "~packages/core/utils/index.tsx";
import { CanvasNode, NodeId, Node } from "~types";
import { NodeElement } from "./NodeElement";
import { RenderNodeToElement } from "../render/RenderNode";
import { ManagerMethods } from "../manager/methods";
import { connectInternalNode, ConnectedInternalNode } from "./connectors";
const shortid = require("shortid");

export interface Canvas extends ConnectedInternalNode {
  id?: NodeId,
  children?: React.ReactNode
}

export const Canvas = connectInternalNode(({ craft: { node, manager }, children, id }: Canvas) => {
  const internal = React.useRef({ id: null });
  useEffect(() => {
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

  return (
    <React.Fragment>
      {
        node.type === Canvas ? (
          <RenderNodeToElement is="div" className="hi-canvas">
            {
              <React.Fragment>
                {
                  (node as CanvasNode).nodes && (node as CanvasNode).nodes.map((id => (
                    <NodeElement id={id} key={id} />
                  )))
                }
              </React.Fragment>
            }
          </RenderNodeToElement>
        ) : (
            internal.current.id ? (
              <NodeElement id={internal.current.id} />
            ) : null
          )

      }
    </React.Fragment>
  )
});


