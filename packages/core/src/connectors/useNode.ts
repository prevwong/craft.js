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
  const { handlers: managerConnectors, enabled } = useInternalManager((state) => ({enabled: state.options.enabled}));

  const { id, related, actions: { setDOM, setProp }, _inNodeContext, ...collected } = useInternalNode(collect);
  
  const connectors = useConnectorHooks({
      connectDragHandler: [
        (node) => {
          console.log("adding draggable", _inNodeContext)
          if ( _inNodeContext ) {
            node.setAttribute("draggable", "true")
            managerConnectors.drag(node, id);
          }
        },
        (node) => {
          node.removeAttribute("draggable")
        }
      ],
      connectTarget: (node) => {
        if (_inNodeContext) {
          managerConnectors.active(node, id);
          managerConnectors.hover(node, id);
          managerConnectors.drop(node, id);
          setDOM(node);
        }
      }
  }, enabled);

  return {
    id,
    related,
    ...collected as any,
    actions: { setProp },
    _inNodeContext,
    ...connectors
  }
}

