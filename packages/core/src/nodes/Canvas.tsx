import React, { useState, useEffect } from "react";
import { NodeId, Node, NodeRules } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes } from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
import { ERROR_ROOT_CANVAS_NO_ID, ERROR_INFINITE_CANVAS } from "craftjs-utils";
const invariant = require("invariant");

type GetComponentProps<T> = T extends string | React.ComponentType<infer P> | React.Component<infer P> ? P : never

export type Canvas<T> = {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: T;
  children?: React.ReactNode;
  passThrough?: boolean;
} & Pick<NodeRules, 'incoming' | 'outgoing'> & GetComponentProps<T>;



export function Canvas<T>({ is, children, passThrough, ...props }: Canvas<T>) {
  const id = props.id;
  const { actions: { add }, query, _inContext } = useInternalManager();
  const { node, nodeId, _inNodeContext } = useInternalNode((node) => ({ node: node.data, nodeId: node.id }));
  const [internalId, setInternalId] = useState(null);
  const [initialised, setInitialised] = useState(false);
  useEffect(() => {
    if (_inContext && _inNodeContext) {
      if (node.isCanvas ) {
        invariant(passThrough, ERROR_INFINITE_CANVAS)
        if ( !node.nodes ) {
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
            const rootNode = query.transformJSXToNode(
              React.createElement(Canvas, {is,...props} as any, children)
            );
            internalId = rootNode.id;
            add(rootNode, nodeId);
          } else {
            internalId = node._childCanvas[id];
          }
          setInternalId(internalId);
      }
    }

    setInitialised(true);
  }, []);

  return (
    <React.Fragment>
      {
        initialised ? (
          (_inContext && _inNodeContext) ?
            (
              node.isCanvas && node.nodes ? (
              <SimpleElement render={React.createElement(node.type, props, (
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
                (internalId) ? (
                  <NodeElement id={internalId} />
                ) : null
              )
            ) : React.createElement(is as any, props, children)
        ) : null
      }
    </React.Fragment>
  );
}

// Canvas.name = 'Canvas'
