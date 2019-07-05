import React, { useEffect, useMemo } from "react";
import { NodeId, Node } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { RenderNodeToElement } from "../render/RenderNode";
import {useNode, mapChildrenToNodes} from "../nodes";
import {useManager} from "../manager";
import { createNode } from "../shared/createNode";
const shortid = require("shortid");
const invariant = require("invariant");

export interface Canvas extends React.Props<any> {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: React.ElementType
}


export const isCanvas = (node: Node) => node.data.type === Canvas

export const Canvas = ({id, is="div", children, ...props}: Canvas) => {
  const {add, pushChildCanvas} = useManager();
  const {node} = useNode();

  const internal = React.useRef({ id: null });
  useEffect(() => {
    let canvasId = `canvas-${shortid.generate()}`;

    if (node.data.type === Canvas) {
      if ( !node.data.nodes ) {  // don't recreate nodes from children after initial hydration
        canvasId = internal.current.id = node.id;
        const childNodes = mapChildrenToNodes(children, canvasId);
        add(node.id, childNodes);
      }
    } else {
      invariant(id, 'Root canvas cannot ommit `id` prop')
      if (!node.data._childCanvas || (node.data._childCanvas && !node.data._childCanvas[id])) {
        const rootNode = createNode({
          type: Canvas,
          props: {is, children},
        }, canvasId);
        internal.current.id = canvasId;
        pushChildCanvas(node.id, id, rootNode);
      } else {
       internal.current.id = node.data._childCanvas[id];
      }
    }
  }, []);

  return useMemo(() => (
    <React.Fragment>
       {
        node.data.type === Canvas ? (
          <RenderNodeToElement is={is} {...props}>
            {
              <React.Fragment>
                {
                  node.data.nodes && node.data.nodes.map((id => (
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
  ), [node]);
}

