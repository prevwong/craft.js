import { ERROR_NOT_IN_RESOLVER, getRandomId } from '@craftjs/utils';
import invariant from 'tiny-invariant';

import { getResolverConfig, resolveComponentToType } from './resolveNode';

import { FreshNode, LegacyNode, Node, Resolver } from '../interfaces';

export const createNode = (partialNode: Partial<Node> = {}): Node => ({
  id: partialNode.id || getRandomId(),
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
  const type = partialNode.type || 'div';
  const resolverConfig = getResolverConfig(type, resolver);

  invariant(
    resolverConfig,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', `${type}`)
  );

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

export const isLegacyNode = (
  node: Node | LegacyNode | FreshNode
): node is LegacyNode =>
  typeof node === 'object' && !!(node as LegacyNode).data;

export const adaptLegacyNode = (
  node: Node | LegacyNode | FreshNode,
  resolver: Resolver
) => {
  if (isLegacyNode(node)) {
    const {
      id,
      data: { type: componentType, ...legacyNodeData },
    } = node;

    const type = resolveComponentToType(resolver, componentType);
    invariant(
      type,
      ERROR_NOT_IN_RESOLVER.replace(
        '%node_type%',
        `${(componentType as any).displayName || (componentType as any).name}`
      )
    );

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

export const asLegacyNode = (node: Node, resolver: Resolver) => {
  const resolvedConfig = getResolverConfig(node.type, resolver);

  const legacyNode: LegacyNode = {
    id: node.id,
    data: {
      type: resolvedConfig.component,
      name: node.type,
      displayName: resolvedConfig.displayName,
      parent: node.parent,
      props: node.props,
      custom: node.custom,
      hidden: node.hidden,
      isCanvas: node.isCanvas,
      nodes: node.nodes,
      linkedNodes: node.linkedNodes,
    },
    rules: resolvedConfig.rules,
    related: resolvedConfig.related,
    events: {
      selected: false,
      hovered: false,
      dragged: false,
    },
    dom: null,
  };

  return legacyNode;
};
