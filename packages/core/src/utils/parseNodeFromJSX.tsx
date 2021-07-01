import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';

import { Node, Resolver, UserComponentConfig } from '../interfaces';
import { createNode } from './createNode';
import { defaultElementProps, Element, elementPropToNodeData } from '../nodes';
import { resolveComponent } from './resolveComponent';
import invariant from 'tiny-invariant';

export function parseNodeFromJSX(
  jsx: React.ReactElement | string,
  resolver: Resolver
): Node {
  let element = jsx as React.ReactElement;
  let componentType = element.type as any;

  let node: Node = createNode();

  if (componentType === Element) {
    const mergedProps = {
      ...defaultElementProps,
      ...node.props,
    };

    node.props = Object.keys(node.props).reduce((props, key) => {
      if (Object.keys(defaultElementProps).includes(key)) {
        // If a <Element /> specific props is found (ie: "is", "canvas")
        // Replace the node.data with the value specified in the prop
        node[elementPropToNodeData[key] || key] = mergedProps[key];
      } else {
        // Otherwise include the props in the node as usual
        props[key] = node.props[key];
      }

      return props;
    }, {});

    componentType = node.type;
  }

  node.type = resolveComponent(resolver, componentType);
  invariant(node.type, ERROR_NOT_IN_RESOLVER);

  node.displayName = node.type;

  const userComponentConfig = componentType.craft as UserComponentConfig<any>;

  if (userComponentConfig) {
    node.displayName = userComponentConfig.displayName || node.displayName;

    node.props = {
      ...(userComponentConfig.props || {}),
      ...node.props,
    };

    node.custom = {
      ...(userComponentConfig.custom || {}),
      ...node.custom,
    };

    if (
      userComponentConfig.isCanvas !== undefined &&
      userComponentConfig.isCanvas !== null
    ) {
      node.isCanvas = userComponentConfig.isCanvas;
    }
  }

  return node;
}
