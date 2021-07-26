import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import invariant from 'tiny-invariant';

import { getRandomNodeId } from './getRandomNodeId';
import { getResolverConfig, resolveComponentToType } from './resolveNode';

import { FreshNode, LegacyNode, Node, Resolver } from '../interfaces';

export const createNode = (partialNode: Partial<Node> = {}): Node => ({
  id: partialNode.id || getRandomNodeId(),
  type: partialNode.type || 'div',
  displayName: partialNode.displayName || partialNode.type,
  props: {
    ...(partialNode.props || {}),
  },
  custom: {
    ...(partialNode.custom || {}),
  },
  parent: partialNode.parent || null,
  nodes: [...(partialNode.nodes || [])],
  linkedNodes: {
    ...(partialNode.linkedNodes || {}),
  },
  hidden: partialNode.hidden || false,
  isCanvas: partialNode.isCanvas || false,
});

export const createNodeWithResolverConfig = (
  partialNode: Partial<Node>,
  resolver: Resolver
) => {
  const resolverConfig = getResolverConfig(partialNode.type || 'div', resolver);

  if (!resolverConfig) {
    return createNode(partialNode);
  }

  return createNode({
    ...partialNode,
    displayName: partialNode.displayName || resolverConfig.displayName,
    props: {
      ...resolverConfig.props,
      ...(partialNode.props ? partialNode.props : {}),
    },
    custom: {
      ...resolverConfig.custom,
      ...(partialNode.custom ? partialNode.custom : {}),
    },
    isCanvas: partialNode.isCanvas || resolverConfig.isCanvas,
  });
};

export const adaptLegacyNode = (
  node: Node | LegacyNode | FreshNode,
  resolver: Resolver
) => {
  if ((node as LegacyNode).data) {
    const {
      id,
      data: { type: componentType, ...legacyNodeData },
    } = node as LegacyNode;

    const type = resolveComponentToType(resolver, componentType);
    invariant(type, ERROR_NOT_IN_RESOLVER);

    return createNodeWithResolverConfig(
      {
        id,
        type,
        ...legacyNodeData,
      },
      resolver
    );
  }

  return createNodeWithResolverConfig(node, resolver);
};
