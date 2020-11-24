import { Node, Nodes } from '@craftjs/core';
import flatten from 'lodash/flatten';

import { Text } from '../render';

export const craftNodeToSlateNode = (
  node: Node,
  nodes: Nodes,
  textPropKey: string
) => {
  const { id, data } = node;
  const {
    name,
    type,
    props: { [textPropKey]: textProp, ...props },
    custom,
    nodes: childNodes,
  } = data;

  const children = childNodes
    ? childNodes.map((id) =>
        craftNodeToSlateNode(nodes[id], nodes, textPropKey)
      )
    : [];

  return {
    id,
    type: name,
    props,
    custom,
    ...(children.length > 0 ? { children } : {}),
    ...(type === Text ? { text: textProp || '' } : {}),
  };
};

export const slateNodesToCraft = (
  nodes: any[],
  parentId: string,
  resolvers: any,
  textPropKey: string
): any => {
  return flatten(
    nodes.map((node) => [
      {
        id: node.id,
        data: {
          type: resolvers[node.type],
          props: {
            ...node.props,
            ...(node.text ? { [textPropKey]: node.text } : {}),
          },
          custom: node.custom || {},
          nodes: node.children
            ? node.children.map((childNode) => childNode.id)
            : [],
          parent: parentId,
        },
      },
      ...(node.children
        ? slateNodesToCraft(node.children, node.id, resolvers, textPropKey)
        : []),
    ])
  );
};
