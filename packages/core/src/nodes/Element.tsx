import React, { useState } from "react";
import { Node, NodeId } from "../interfaces";
import { useInternalNode } from "./useInternalNode";
import { ERROR_ROOT_CANVAS_NO_ID, useEffectOnce } from "@craftjs/utils";
import invariant from "tiny-invariant";
import { useInternalEditor } from "../editor/useInternalEditor";
import { NodeElement } from "./NodeElement";

export const getElementDefaultProps = (props) => {
  return {
    ...props,
    is: props.is || "div",
    isCanvas: props.isCanvas || false,
    custom: props.custom || {},
  };
};

export type Element<T extends React.ElementType> = {
  id?: NodeId;
  is?: T;
  custom?: Record<string, any>;
  children?: React.ReactNode;
} & React.ComponentProps<T>;

export function Element<T extends React.ElementType>({
  id,
  children,
  ...otherProps
}: Element<T>) {
  const props = getElementDefaultProps(otherProps);

  const { query, actions } = useInternalEditor();
  const { node, inNodeContext } = useInternalNode((node) => ({
    node: {
      id: node.id,
      data: node.data,
    },
  }));

  const [internalId, setInternalId] = useState<NodeId | null>(null);
  const [initialised, setInitialised] = useState(false);

  useEffectOnce(() => {
    invariant(id != null, ERROR_ROOT_CANVAS_NO_ID);
    const { id: nodeId, data } = node;

    if (inNodeContext) {
      let internalId;

      const existingNode =
        data.linkedNodes &&
        data.linkedNodes[id] &&
        query.node(data.linkedNodes[id]).get();

      if (existingNode) {
        internalId = existingNode.id;
      } else {
        const tree = query.parseTreeFromReactNode(
          React.createElement(Element, props, children),
          (node) => {
            node.id = existingNode ? existingNode.id : node.id;
            node.data = existingNode ? existingNode.data : node.data;
          }
        );

        internalId = tree.rootNodeId;
        actions.addLinkedNodeFromTree(tree, nodeId, id);
      }

      setInternalId(internalId);
    }

    setInitialised(true);
  });

  return initialised ? <NodeElement id={internalId} /> : null;
}
