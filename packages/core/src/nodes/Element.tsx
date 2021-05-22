import { ERROR_TOP_LEVEL_ELEMENT_NO_ID, useEffectOnce } from '@craftjs/utils';
import React, { useState } from 'react';
import invariant from 'tiny-invariant';

import { NodeElement } from './NodeElement';
import { useInternalNode } from './useInternalNode';

import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeId } from '../interfaces';

export const defaultElementProps = {
  is: 'div',
  canvas: false,
  custom: {},
  hidden: false,
};

export const elementPropToNodeData = {
  is: 'type',
  canvas: 'isCanvas',
};

export type Element<T extends React.ElementType> = {
  id?: NodeId;
  is?: T;
  custom?: Record<string, any>;
  children?: React.ReactNode;
  canvas?: boolean;
} & React.ComponentProps<T>;

export function Element<T extends React.ElementType>({
  id,
  children,
  ...elementProps
}: Element<T>) {
  const { is } = {
    ...defaultElementProps,
    ...elementProps,
  };

  const { query, actions } = useInternalEditor();
  const { node, inNodeContext } = useInternalNode((node) => ({
    node: {
      id: node.id,
      data: node.data,
    },
  }));

  const [linkedNodeId, setLinkedNodeId] = useState<NodeId | null>(null);

  useEffectOnce(() => {
    invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);
    const { id: nodeId, data } = node;

    if (inNodeContext) {
      let linkedNodeId;

      const existingNode =
        data.linkedNodes &&
        data.linkedNodes[id] &&
        query.node(data.linkedNodes[id]).get();

      // Render existing linked Node if it already exists (and is the same type as the JSX)
      if (existingNode && existingNode.data.type === is) {
        linkedNodeId = existingNode.id;
      } else {
        // otherwise, create and render a new linked Node
        const linkedElement = React.createElement(
          Element,
          elementProps,
          children
        );

        const tree = query.parseReactElement(linkedElement).toNodeTree();

        linkedNodeId = tree.rootNodeId;
        actions.history.ignore().addLinkedNodeFromTree(tree, nodeId, id);
      }

      setLinkedNodeId(linkedNodeId);
    }
  });

  return linkedNodeId ? <NodeElement id={linkedNodeId} /> : null;
}
