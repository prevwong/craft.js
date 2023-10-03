import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { mergeTrees } from './mergeTrees';
import { resolveComponent } from './resolveComponent';
import { asLegacyNode, createNodeWithResolverConfig } from './types';

import {
  LegacyNode,
  LegacyNodeTree,
  Node,
  Resolver,
  BackwardsCompatibleNodeTree,
  NodeTree,
} from '../interfaces';
import { defaultElementProps, Element } from '../nodes/Element';

function parseBackwardsCompatibleNodeFromJSX(
  legacy: boolean,
  element: React.ReactElement,
  resolver: Resolver,
  normalize?: (node: Node | LegacyNode, element: React.ReactElement) => void
): LegacyNodeTree | NodeTree {
  let { type: componentType, props: componentProps } = element;

  const nodeConfig: Partial<Node> = {
    type: 'div',
    displayName: 'div',
    props: {},
    isCanvas: false,
    hidden: false,
    custom: {},
  };

  if (componentType === Element) {
    const { is, canvas, custom, hidden, ...props } = {
      ...defaultElementProps,
      ...componentProps,
    } as React.ComponentProps<typeof Element>;

    componentType = is;
    nodeConfig.isCanvas = canvas;
    nodeConfig.custom = custom;
    nodeConfig.hidden = hidden;
    nodeConfig.props = {
      ...nodeConfig.props,
      ...props,
    };
  } else {
    nodeConfig.props = componentProps;
  }

  nodeConfig.type = resolveComponent(resolver, componentType);
  nodeConfig.displayName = nodeConfig.type;

  invariant(
    nodeConfig.type,
    ERROR_NOT_IN_RESOLVER.replace(
      '%node_type%',
      typeof componentType === 'string' ? componentType : componentType.name
    )
  );

  const node = createNodeWithResolverConfig(nodeConfig, resolver);

  if (normalize) {
    normalize(node, element);
  }

  let childrenNodes: BackwardsCompatibleNodeTree[] = [];

  if (node.props.children) {
    childrenNodes = React.Children.toArray(node.props.children).reduce<
      BackwardsCompatibleNodeTree[]
    >((accum, child: any) => {
      if (React.isValidElement(child)) {
        accum.push(
          parseBackwardsCompatibleNodeFromJSX(
            legacy,
            child,
            resolver,
            normalize
          )
        );
      }
      return accum;
    }, []);
    if (childrenNodes.length > 0) {
      delete node.props.children;
    }
  }

  if (!legacy) {
    return mergeTrees(node, childrenNodes as NodeTree[]);
  }

  return mergeTrees(
    asLegacyNode(node, resolver),
    childrenNodes as LegacyNodeTree[]
  );
}

export function parseLegacyNodeFromJSX(
  element: React.ReactElement,
  resolver: Resolver,
  normalize?: (node: LegacyNode, element: React.ReactElement) => void
) {
  return parseBackwardsCompatibleNodeFromJSX(
    true,
    element,
    resolver,
    normalize
  ) as LegacyNodeTree;
}

export function parseNodeFromJSX(
  element: React.ReactElement,
  resolver: Resolver,
  normalize?: (node: Node, element: React.ReactElement) => void
) {
  return parseBackwardsCompatibleNodeFromJSX(
    false,
    element,
    resolver,
    normalize
  ) as NodeTree;
}
