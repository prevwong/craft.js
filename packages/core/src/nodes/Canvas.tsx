import React, { useMemo, useLayoutEffect, useState } from "react";
import { NodeId, Node } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes } from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
import { ERROR_ROOT_CANVAS_NO_ID } from "craftjs-utils";
import { type } from "os";
const invariant = require("invariant");

export type Canvas = {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: React.ElementType
} & React.Props<any> & any;


export const isCanvas = (node: Node) => node.data.type === Canvas

export const Canvas = ({ is = "div", children, ...props }: Canvas) => {
  const id = props.id;
  const { actions: { add }, query, _inContext } = useInternalManager();
  const { node, nodeId, _inNodeContext } = useInternalNode((node) => ({ node: node.data, nodeId: node.id }));
  const [internalId, setInternalId] = useState(null);
  const [initialised, setInitialised] = useState(false);
  useLayoutEffect(() => {
    if (!_inContext || !_inNodeContext) return;

    if (node.type === Canvas) {
      if (!node.nodes) {  // don't recreate nodes from children after initial hydration
        const childNodes = mapChildrenToNodes(children, (jsx) => {
          const node = query.transformJSXToNode(jsx)
          return node;
        });
        add(childNodes, nodeId);
      }
    } else {
      invariant(id, ERROR_ROOT_CANVAS_NO_ID);
      let internalId;
      
      if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
        const rootNode = query.transformJSXToNode(<Canvas is={is} {...props}>{children}</Canvas>);
        internalId = rootNode.id;
        add(rootNode, nodeId);
      } else {
        internalId = node._childCanvas[id];
      }
      setInternalId(internalId);
    }
      setInitialised(true);
  
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
              internalId && initialised ? (
                <NodeElement id={internalId} />
              ) : null
            )
          : children
      }
    </React.Fragment>
  ), [initialised, node, internalId]);
}

// Canvas.name = 'Canvas'
