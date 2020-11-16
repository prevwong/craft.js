import { Node, Nodes } from '@craftjs/core';
import flatten from 'lodash/flatten';
import React from 'react';

export const Text = ({ text }) => {
  return text;
};

export const Typography = ({ variant, children }) => {
  return React.createElement(variant, { children });
};

Typography.craft = {
  isCanvas: true,
};

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
    ...(text ? { text } : {}),
  };
};

export const resolvers = {
  Text,
  Typography,
};

export const slateNodeToCraftNode = (node: any) => {
  const { id, type, props, custom, text, children } = node;

  return {
    id,
    data: {
      type: resolvers[type],
      props: {
        ...props,
        ...(text ? { children: text } : {}),
      },
      isCanvas: type !== 'Text',
      nodes: children ? children.map((child: any) => child.id) : [],
      custom,
    },
  };
};

export const slateToCraft = (nodes: any[], parentId: string): any => {
  const x = flatten(
    nodes.map((node) => [
      slateNodeToCraftNode(node),
      ...(node.children ? flatten(slateToCraft(node.children, parentId)) : []),
    ])
  );

  return x;
};

export const flattenSlateNodes = (nodes: any[]): any => {
  return flatten(
    nodes.map((node) => [
      {
        ...node,
        props: {
          ...node.props,
          ...(node.text ? { text: node.text } : {}),
        },
        ...(node.children
          ? { nodes: node.children.map((child) => child.id) }
          : {}),
      },
      ...(node.children ? flattenSlateNodes(node.children) : []),
    ])
  );
};
