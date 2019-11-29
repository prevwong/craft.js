import React from "react";
import { Node  } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
import {  useConnectorHooks, ConnectorElementWrapper } from "craftjs-utils";


export type useNode<S = null> = useInternalNode<S> & {
  actions: Pick<useInternalNode<S>['actions'], 'setProp'>,
  connectTarget: ConnectorElementWrapper;
  connectDragHandler: ConnectorElementWrapper;
}

export function useNode(): useNode
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S> {
  const { handlers } = useInternalManager();

  const { id, related, actions: { setDOM, setProp }, _inNodeContext, ...collected } = useInternalNode(collect);

  const connectors = useConnectorHooks({
      connectDragHandler: [
        (node) => {
          if ( _inNodeContext ) {
            node.setAttribute("draggable", true)
            handlers.dragNode(node, id);
            handlers.dragNodeEnd(node, id);
          }
        },
        (node) => {
          node.removeAttribute("draggable", true)
        }
      ],
      connectTarget: (node) => {
        if (_inNodeContext) {
          handlers.selectNode(node, id);
          handlers.hoverNode(node, id);
          handlers.dragNodeOver(node, id);
          setDOM(node);
        }
      }
    });

  return {
    id,
    related,
    ...collected as any,
    actions: { setProp },
    _inNodeContext,
    ...connectors
  }
}

