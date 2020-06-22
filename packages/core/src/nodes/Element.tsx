import React, { useState } from 'react';
import { NodeId } from '../interfaces';
import { useInternalNode } from './useInternalNode';
import { ERROR_TOP_LEVEL_ELEMENT_NO_ID, useEffectOnce } from '@craftjs/utils';
import invariant from 'tiny-invariant';
import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeElement } from './NodeElement';

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
  ...otherProps
}: Element<T>) {
  const props = {
    ...defaultElementProps,
    ...otherProps,
  };

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
    invariant(id !== null, ERROR_TOP_LEVEL_ELEMENT_NO_ID);
    const { id: nodeId, data } = node;

    if (inNodeContext) {
      let internalId,
        newProps = props;

      const existingNode =
        data.linkedNodes &&
        data.linkedNodes[id] &&
        query.node(data.linkedNodes[id]).get();

      if (
        existingNode &&
        existingNode.data.type === props.is &&
        typeof props.is !== 'string'
      ) {
        newProps = {
          ...newProps,
          ...existingNode.data.props,
        };
      }

      const linkedElement = React.createElement(Element, newProps, children);

      const tree = query
        .parseReactElement(linkedElement)
        .toNodeTree((node, jsx) => {
          if (jsx === linkedElement) {
            node.id = existingNode ? existingNode.id : node.id;
            node.data = {
              ...(existingNode ? existingNode.data.props : {}),
              ...node.data,
            };
          }
        });

      internalId = tree.rootNodeId;
      actions.addLinkedNodeFromTree(tree, nodeId, id);

      setInternalId(internalId);
    }

    setInitialised(true);
  });

  return initialised ? <NodeElement id={internalId} /> : null;
}
