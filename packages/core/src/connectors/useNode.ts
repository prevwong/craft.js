import React, { useMemo, useRef } from "react";
import { Node  } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";
import { useInternalManager } from "../manager/useInternalManager";
import { wrapConnectorHooks } from "../utils/wrapConnectorHooks";
import { NodeProvider } from "../nodes/NodeContext";


export type useNode<S = null> = useInternalNode<S> & {
  actions: Pick<useInternalNode<S>['actions'], 'setProp'>,
  connectTarget: Function;
  connectDragHandler: Function;
}

export function useNode(): useNode
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S> {
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

  const connectors = wrapConnectorHooks({
      connectDragHandler: (node) => {
        if ( _inNodeContext && node && currentNode.current !== node) {
          if (currentNode.current) {
            currentNode.current.removeEventListener('dragstart', event.onDragStart);
          }
          node.addEventListener('dragstart', event.onDragStart);
        }
      },
      connectTarget: (node, t) => {
        if ( _inNodeContext && node && currentNode.current !== node )  {
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

  return {
    id,
    related,
    ...collected as any,
    actions: { setProp },
    _inNodeContext,
    ...connectors
  }
}

