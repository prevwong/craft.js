import { Node, Nodes } from '@craftjs/core';
import flatten from 'lodash/flatten';

import { resolvers } from '../Slate';

export const craftNodeToSlateNode = (node: Node, nodes: Nodes) => {
  const { id, data } = node;
  const {
    name,
    props: { text, ...props },
    custom,
    nodes: childNodes,
  } = data;

  const children = childNodes
    ? childNodes.map((id) => craftNodeToSlateNode(nodes[id], nodes))
    : [];

  return {
    id,
    type: name,
    props,
    custom,
    ...(children.length > 0 ? { children } : {}),
    ...(name === 'Text' ? { text: text || '' } : {}),
  };
};

export const slateNodesToCraft = (nodes: any[], parentId: string): any => {
  return flatten(
    nodes.map((node) => [
      {
        id: node.id,
        data: {
          type: resolvers[node.type],
          props: {
            ...node.props,
            ...(node.text ? { text: node.text } : {}),
          },
          custom: node.custom || {},
          nodes: node.children
            ? node.children.map((childNode) => childNode.id)
            : [],
          parent: parentId,
        },
      },
      ...(node.children ? slateNodesToCraft(node.children, node.id) : []),
    ])
  );
};
