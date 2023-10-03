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

export type ElementProps<T extends React.ElementType> = {
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
}: ElementProps<T>) {
  const { is } = {
    ...defaultElementProps,
    ...elementProps,
  };

  const { query, actions } = useInternalEditor();
  const { id: nodeId, inNodeContext } = useInternalNode();

  const [linkedNodeId, setLinkedNodeId] = useState<NodeId | null>(null);

  useEffectOnce(() => {
    invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);

    if (inNodeContext) {
      let linkedNodeId;

      const existingLinkedNode = query
        .node(nodeId)
        .getLinkedNodes()
        .find((linkedNode) => linkedNode.id === id);

      if (existingLinkedNode && existingLinkedNode.node.getComponent() === is) {
        linkedNodeId = existingLinkedNode.node.id;
      } else {
        // otherwise, create and render a new linked Node
        const linkedElement = React.createElement(
          Element,
          elementProps,
          children
        );

        const tree = query.parseReactElementAsNodeTree(linkedElement);

        linkedNodeId = tree.rootNodeId;
        actions.history
          .merge({
            ignoreIfNoPreviousRecords: true,
          })
          .addLinkedNodeFromTree(tree, nodeId, id);
      }

      setLinkedNodeId(linkedNodeId);
    }
  });

  return linkedNodeId ? <NodeElement id={linkedNodeId} /> : null;
}
