import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { mergeTrees } from './mergeTrees';
import { resolveComponent } from './resolveComponent';
import { createNodeWithResolverConfig } from './types';

import { Node, NodeTree, Resolver } from '../interfaces';
import { defaultElementProps, Element } from '../nodes/Element';

export function parseNodeFromJSX(
  element: React.ReactElement,
  resolver: Resolver,
  normalize?: any
): NodeTree {
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

  invariant(nodeConfig.type, ERROR_NOT_IN_RESOLVER);

  const node = createNodeWithResolverConfig(nodeConfig, resolver);

  if (normalize) {
    normalize(node, element);
  }

  let childrenNodes = [];

  if (node.props.children) {
    childrenNodes = React.Children.toArray(node.props.children).reduce<
      NodeTree[]
    >((accum, child: any) => {
      if (React.isValidElement(child)) {
        accum.push(parseNodeFromJSX(child, resolver));
      }
      return accum;
    }, []);
    if (childrenNodes.length > 0) {
      delete node.props.children;
    }
  }

  return mergeTrees(node, childrenNodes);
}
