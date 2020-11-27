import { Node, Nodes } from '@craftjs/core';
import flatten from 'lodash/flatten';
import { Dictionary } from 'lodash';
import fromPairs from 'lodash/fromPairs';

import { Text } from '../render';

const getSlateMarks = (marks: any) => {
  if (!marks || !Array.isArray(marks) || marks.length < 1) {
    return {};
  }
  return fromPairs(
    marks.map((mark: keyof typeof craftToSlateMarks) => [
      craftToSlateMarks[mark],
      true,
    ])
  );
};

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
    // TODO: make this more extensible
    ...(custom.marks ? getSlateMarks(custom.marks) : {}),
  };
};

export const craftToSlateMarks = {
  B: 'bold',
  Em: 'italic',
  U: 'underline',
  InlineCode: 'code',
};

export const slateToCraftMarks: Dictionary<any> = fromPairs(
  Object.entries(craftToSlateMarks).map((entry) => entry.reverse())
);

const getCraftMarks = (node: any) => {
  const marks = Object.keys(node)
    .map((key) => slateToCraftMarks[key])
    .filter((mark) => !!mark);

  if (marks.length < 1) {
    return {};
  }

  return { marks };
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
          custom: {
            ...(node.custom || {}),
            // ...getCraftMarks(node),
          },
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
