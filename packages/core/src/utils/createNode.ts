import React from 'react';

import { getRandomNodeId } from './getRandomNodeId';

import { Node, FreshNode, UserComponentConfig } from '../interfaces';
import {
  defaultElementProps,
  Element,
  Canvas,
  elementPropToNodeData,
  deprecateCanvasComponent,
} from '../nodes';
import { NodeProvider } from '../nodes/NodeContext';

const getNodeTypeName = (type: any) =>
  typeof type == 'string' ? type : (type as any).name;

export function createNode(
  newNode: FreshNode,
  normalize?: (node: Node) => void
) {
  let actualType = newNode.data.type as any;
  let id = newNode.id || getRandomNodeId();

  const node: Node = {
    ...newNode,
    id,
    _hydrationTimestamp: Date.now(),
    data: {
      type: actualType,
      name: getNodeTypeName(actualType),
      displayName: getNodeTypeName(actualType),
      props: {},
      custom: newNode.data.custom || {},
      parent: null,
      isCanvas: false,
      hidden: false,
      nodes: [],
      linkedNodes: {},
      ...newNode.data,
    },
    related: {},
    events: {
      selected: false,
      dragged: false,
      hovered: false,
    },
    rules: {
      canDrag: () => true,
      canDrop: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
    },
    dom: null,
  };

  // @ts-ignore
  if (node.data.type === Element || node.data.type === Canvas) {
    const mergedProps = {
      ...defaultElementProps,
      ...node.data.props,
    };

    node.data.props = Object.keys(node.data.props).reduce((props, key) => {
      if (Object.keys(defaultElementProps).includes(key)) {
        // If a <Element /> specific props is found (ie: "is", "canvas")
        // Replace the node.data with the value specified in the prop
        node.data[elementPropToNodeData[key] || key] = mergedProps[key];
      } else {
        // Otherwise include the props in the node as usual
        props[key] = node.data.props[key];
      }

      return props;
    }, {});

    actualType = node.data.type;
    node.data.name = getNodeTypeName(actualType);
    node.data.displayName = getNodeTypeName(actualType);

    const usingDeprecatedCanvas = node.data.type === Canvas;
    if (usingDeprecatedCanvas) {
      node.data.isCanvas = true;
      deprecateCanvasComponent();
    }
  }

  if (normalize) {
    normalize(node);
  }

  const userComponentConfig: UserComponentConfig<any> = actualType.craft;

  if (userComponentConfig) {
    node.data.displayName =
      userComponentConfig.displayName ||
      userComponentConfig.name ||
      node.data.displayName;

    node.data.isCanvas =
      userComponentConfig.isCanvas !== undefined &&
      userComponentConfig.isCanvas !== null
        ? userComponentConfig.isCanvas
        : node.data.isCanvas;

    if (userComponentConfig.rules) {
      Object.keys(userComponentConfig.rules).forEach((key) => {
        if (['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(key)) {
          node.rules[key] = userComponentConfig.rules[key];
        }
      });
    }

    node.data.props = {
      ...(userComponentConfig.props ||
        userComponentConfig.defaultProps ||
        actualType.craft.defaultProps ||
        {}),
      ...node.data.props,
    };

    node.data.custom = {
      ...(userComponentConfig.custom || {}),
      ...node.data.custom,
    };

    if (userComponentConfig.related) {
      const relatedNodeContext = {
        id: node.id,
        related: true,
      };

      Object.keys(userComponentConfig.related).forEach((comp) => {
        node.related[comp] = () =>
          React.createElement(
            NodeProvider,
            relatedNodeContext,
            React.createElement(userComponentConfig.related[comp])
          );
      });
    }
  }

  return node;
}
