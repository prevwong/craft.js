import React, { useState, useEffect } from "react";
import { NodeId, NodeRules } from "../interfaces";
import { NodeElement } from "./NodeElement";
import { SimpleElement } from "../render/RenderNode";
import { mapChildrenToNodes } from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { useInternalEditor } from "../editor/useInternalEditor";
import { ERROR_ROOT_CANVAS_NO_ID, ERROR_INFINITE_CANVAS } from "craftjs-utils";
const invariant = require("invariant");

type GetComponentProps<T extends React.ElementType> = React.ComponentProps<T>

export type Canvas<T extends React.ElementType> = {
  id?: NodeId,
  style?: any,
  className?: any,
  is?: T;
  children?: React.ReactNode;
  passThrough?: boolean;
} & Partial<Pick<NodeRules, 'canMoveIn' | 'canMoveOut'>> & React.ComponentProps<T>;



export function Canvas<T extends React.ElementType>({ is, children, passThrough, ...props }: Canvas<T>) {
  const id = props.id;
  const { actions: { add }, query, inContext } = useInternalEditor();
  const { node, nodeId, inNodeContext } = useInternalNode((node) => ({ node: node.data, nodeId: node.id }));
  const [internalId, setInternalId] = useState(null);
  const [initialised, setInitialised] = useState(false);
  useEffect(() => {
    if (inContext && inNodeContext) {
      if (node.isCanvas ) {
        invariant(passThrough, ERROR_INFINITE_CANVAS)
        if ( !node.nodes ) {
          const childNodes = mapChildrenToNodes(children, (jsx) => {
            const node = query.createNode(jsx)
            return node;
          });

          add(childNodes, nodeId);
        }
      } else {
          invariant(id, ERROR_ROOT_CANVAS_NO_ID);

          let internalId;

          if (!node._childCanvas || (node._childCanvas && !node._childCanvas[id])) {
            const rootNode = query.createNode(
              React.createElement(Canvas, { is, ...props }, children)
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
          (inContext && inNodeContext) ?
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
