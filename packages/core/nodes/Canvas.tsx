import React, { useMemo, useLayoutEffect, useState } from "react";
import { NodeId, Node } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes } from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
const shortid = require("shortid");
const invariant = require("invariant");

export interface Canvas extends React.Props<any> {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: React.ElementType
}


export const isCanvas = (node: Node) => node.data.type === Canvas

export const Canvas = ({ is = "div", children, ...props }: Canvas) => {
  const id = props.id;
  const { actions: { add }, query, _inContext } = useInternalManager();
  const { node, nodeId, _inNodeContext } = useInternalNode((node) => ({ node: node.data, nodeId: node.id }));
  const [internalId, setInternalId] = useState(null);
  useLayoutEffect(() => {
    if (!_inContext || !_inNodeContext) return;
    let canvasId = `canvas-${shortid.generate()}`;

    if (node.type === Canvas) {
      if (!node.nodes) {  // don't recreate nodes from children after initial hydration
        canvasId = nodeId;
        const childNodes = mapChildrenToNodes(children, { parent: canvasId }, (node) => {
          return node;
        });
        add(childNodes, nodeId);
      }
    } else {
      invariant(id, 'Root canvas cannot ommit `id` prop');
      let internalId;
      
      if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
        const rootNode = query.createNode({
          type: Canvas,
          props: { is, children, ...props },
        }, canvasId);
        internalId = canvasId;
        add(rootNode, nodeId);
      } else {
        internalId = node._childCanvas[id];
      }
      setInternalId(internalId);
    }
  
  }, []);

  return useMemo(() => (
    <React.Fragment>
      {
        (_inContext && _inNodeContext) ?
          node.type === Canvas ? (
            <SimpleElement render={React.createElement(node.subtype, props, (
              <React.Fragment>
                {
                  node.nodes && node.nodes.map(((id: NodeId) => (
                    <NodeElement id={id} key={id} />
                  )))
                }
              </React.Fragment>
            ))
            } />
          ) : (
              internalId ? (
                <NodeElement id={internalId} />
              ) : null
            )
          : children
      }
    </React.Fragment>
  ), [node, internalId]);
}

// Canvas.name = 'Canvas'