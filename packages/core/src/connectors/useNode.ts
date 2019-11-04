import React, { useMemo, useRef } from "react";
import { Node  } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
import { wrapConnectorHooks } from "../utils/wrapConnectorHooks";
import { NodeProvider } from "nodes/NodeContext";

type ConnectedNodeShared = NodeProvider & {
  connectTarget: Function;
  connectDragHandler: Function;
  actions: any;
  _inNodeContext: boolean
}

export type ConnectedNode<S = null> = S extends null ? ConnectedNodeShared : S & ConnectedNodeShared

export function useNode(): ConnectedNode
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S> {
  const {handlers} = useInternalManager();
  const { id, related, actions: { setDOM, setProp }, _inNodeContext, ...collected } = useInternalNode(collect);

  const currentNode = useRef<HTMLElement>();

  const event = useMemo(() => {
    return {
      onMouseDown: (e: MouseEvent) => handlers.internal.onMouseDown(e, id),
      onMouseOver: (e: MouseEvent) => handlers.internal.onMouseOver(e, id),
      onDragStart: (e: MouseEvent) => handlers.dnd.onDragStart(e, id),
      onDragOver: (e: MouseEvent) => handlers.dnd.onDragOver(e, id),
      onDragEnd: (e: MouseEvent) => handlers.dnd.onDragEnd(e)
    }
  }, []);

  const connectors = useMemo(() => {
    return wrapConnectorHooks({
      connectDragHandler: (node) => {
        if (node && currentNode.current !== node) {
          if (currentNode.current) {
            currentNode.current.removeEventListener('dragstart', event.onDragStart);
          }
          node.addEventListener('dragstart', event.onDragStart);
        }
      },
      connectTarget: (node) => {
        if ( node && currentNode.current !== node )  {
          if ( currentNode.current) {
            currentNode.current.removeEventListener('mousedown', event.onMouseDown);
            currentNode.current.removeEventListener('mouseover', event.onMouseOver);
            currentNode.current.removeEventListener('dragover', event.onMouseOver);
            currentNode.current.removeEventListener('dragend', event.onMouseOver);
          }
          node.addEventListener('mousedown', event.onMouseDown, true);
          node.addEventListener('mouseover', event.onMouseOver, true);
          node.addEventListener('dragover', event.onDragOver);
          node.addEventListener('dragend', event.onDragEnd);
          currentNode.current = node;

          setDOM(node);
        }
      }
    });
  },[]);

  return {
    id,
    related,
    ...collected as any,
    actions: { setProp },
    _inNodeContext,
    ...connectors
  }
}

