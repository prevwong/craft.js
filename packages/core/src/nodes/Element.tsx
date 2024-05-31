import { ERROR_TOP_LEVEL_ELEMENT_NO_ID } from '@craftjs/utils';
import React from 'react';
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
  hidden?: boolean;
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
  const { node } = useInternalNode((node) => ({
    node: {
      id: node.id,
      data: node.data,
    },
  }));

  invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);

  let linkedNodeId: string;

  const { id: nodeId, data } = node;

  const existingNode =
    data.linkedNodes &&
    data.linkedNodes[id] &&
    query.node(data.linkedNodes[id]).get();

  if (existingNode && existingNode.data.type === is) {
    linkedNodeId = existingNode.id;
  } else {
    const linkedElement = React.createElement(Element, elementProps, children);

    const tree = query.parseReactElement(linkedElement).toNodeTree();

    linkedNodeId = tree.rootNodeId;
    actions.history.ignore().addLinkedNodeFromTree(tree, nodeId, id);
  }

  if (!linkedNodeId) {
    return null;
  }

  return <NodeElement id={linkedNodeId} />;
}
