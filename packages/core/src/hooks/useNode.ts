import { Node  } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";
import { useInternalEditor } from "../editor/useInternalEditor";
import {  useConnectorHooks, ConnectorElementWrapper } from "@craftjs/utils";


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
 * @param collector Collector function to consume values from the corresponding Node's state
 */
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S> {
  const { id, related, actions: { setDOM, setProp }, inNodeContext, ...collected } = useInternalNode(collect);
  const { isRoot, handlers: editorConnectors, enabled } = useInternalEditor((state, query) => ({
    enabled: state.options.enabled,
    isRoot: query.node(id).isRoot()
  }));

  const connectors = useConnectorHooks({
      drag: [
        (node) => {
          if ( inNodeContext && !isRoot ) {
            node.setAttribute("draggable", "true")
            editorConnectors.drag(node, id);
          }
        },
        (node) => {
          node.removeAttribute("draggable")
        }
      ],
      connect: (node) => {
        if (inNodeContext) {
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
    inNodeContext,
    connectors
  }
}

