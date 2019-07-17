import React, { useEffect, useMemo } from "react";
import { NodeId, Node } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes} from "../nodes";
import { createNode } from "../shared/createNode";
import { useInternalNode } from "./useInternalNode";
import { useCollector } from "../shared/useCollector";
import { useManager } from "../manager/useManager";
const shortid = require("shortid");
const invariant = require("invariant");

export interface Canvas extends React.Props<any> {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: React.ElementType
}


export const isCanvas = (node: Node) => node.data.type === Canvas

export const Canvas = React.memo(({id, is="div", children, ...props}: Canvas) => {
  const { actions: { add, pushChildCanvas}, nodes } = useManager((state)=>({nodes: state.nodes}));
  const {node, nodeId}  = useInternalNode((node) => ({node: node.data, nodeId: node.id}));
  // console.log(33, node);
  const internal = React.useRef({ id: null });
  useEffect(() => {
    let canvasId = `canvas-${shortid.generate()}`;

    if (node.type === Canvas) {
      if ( !node.nodes ) {  // don't recreate nodes from children after initial hydration
        canvasId = internal.current.id = nodeId;
        const childNodes = mapChildrenToNodes(children, canvasId);
        // console.log("addding...", nodeId)
        add(nodeId, childNodes);
      }
    } else {
      invariant(id, 'Root canvas cannot ommit `id` prop')
      if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
        const rootNode = createNode({
          type: Canvas,
          props: {is, children, ...props},
        }, canvasId);
        internal.current.id = canvasId;
        pushChildCanvas(nodeId, id, rootNode);
      } else {
       internal.current.id = node._childCanvas[id];
      }
    }
  }, []);

  return useMemo(() => (
    <React.Fragment>
       {
        node.type === Canvas ? (
          <SimpleElement render={React.createElement(is, props, (
            <React.Fragment>
              {
                node.nodes && node.nodes.map((id => (
                  <NodeElement id={id} key={id} />
                )))
              }
            </React.Fragment>
          ))
            } />
        ) : (
            internal.current.id ? (
              <NodeElement id={internal.current.id} />
            ) : null
          )
      }
    </React.Fragment>
  ), [node])
})

// Canvas.name = 'Canvas'