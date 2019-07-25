import React, { useMemo, useLayoutEffect, useState } from "react";
import { NodeId, Node } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes} from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { useManager } from "../connectors";
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
  const { actions: { add, pushChildCanvas}, query } = useManager();
  const {node, nodeId}  = useInternalNode((node) => ({node: node.data, nodeId: node.id}));
  const [internalId, setInternalId] = useState(null);

  useLayoutEffect(() => {
    let canvasId = `canvas-${shortid.generate()}`;

    if (node.type === Canvas) {
      if ( !node.nodes ) {  // don't recreate nodes from children after initial hydration
        canvasId = nodeId;
        const childNodes = mapChildrenToNodes(children, (data, id) => {
          return query.createNode(data, id);
        }, {parent: canvasId});
        add(nodeId, childNodes);
      }
    } else {
      invariant(id, 'Root canvas cannot ommit `id` prop');
      let internalId;
      if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
        const rootNode = query.createNode({
          type: Canvas,
          props: {is, children, ...props},
        }, canvasId);
        internalId = canvasId;
        pushChildCanvas(nodeId, id, rootNode);
      } else {
       internalId = node._childCanvas[id];
      }
      setInternalId(internalId);
    }
  }, []);

  return useMemo(() => (
    <React.Fragment>
       {
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
      }
    </React.Fragment>
  ), [node, internalId]);
}

// Canvas.name = 'Canvas'