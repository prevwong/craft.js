import React from "react";
import { Node  } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";
import { useInternalEditor } from "../editor/useInternalEditor";
import {  useConnectorHooks, ConnectorElementWrapper } from "craftjs-utils";
import { isRoot } from "../nodes";


export type useNode<S = null> = Omit<useInternalNode<S>, "actions"> & Pick<useInternalNode<S>['actions'], 'setProp'> & {
  connectors: {
    connect: ConnectorElementWrapper;
    drag: ConnectorElementWrapper;
  }
}

export function useNode(): useNode


export function useNode<S = null>(collect?: (node: Node) => S): useNode<S>

/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param {function(Node): Collected} [collector] - Transform values from the corresponding Node's state
 */
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S> {
  const { handlers: editorConnectors, enabled } = useInternalEditor((state) => ({enabled: state.options.enabled}));

  const { id, related, actions: { setDOM, setProp }, _inNodeContext, ...collected } = useInternalNode(collect);
  
  const connectors = useConnectorHooks({
      drag: [
        (node) => {
          if ( _inNodeContext && !isRoot(id) ) {
            node.setAttribute("draggable", "true")
            editorConnectors.drag(node, id);
          }
        },
        (node) => {
          node.removeAttribute("draggable")
        }
      ],
      connect: (node) => {
        if (_inNodeContext) {
          editorConnectors.select(node, id);
          editorConnectors.hover(node, id);
          editorConnectors.drop(node, id);
          setDOM(node);
        }
      }
  }, enabled);

  return {
    id,
    related,
    ...collected as any,
    setProp,
    _inNodeContext,
    connectors
  }
}

