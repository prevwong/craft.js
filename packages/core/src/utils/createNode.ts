import React from 'react';
import { NodeData, Node, FreshNode } from '../interfaces';
import { produce } from 'immer';
import { Canvas, deprecateCanvasComponent } from '../nodes/Canvas';
import {
  defaultElementProps,
  Element,
  elementPropToNodeData,
} from '../nodes/Element';
import { NodeProvider } from '../nodes/NodeContext';
import { getRandomNodeId } from './getRandomNodeId';

export function createNode(
  newNode: FreshNode,
  normalize?: (node: Node) => void
) {
  let actualType = newNode.data.type as any;
  let id = newNode.id || getRandomNodeId();

  return produce({}, (node: Node) => {
    node.id = id;
    node._hydrationTimestamp = Date.now();

    node.data = {
      type: actualType,
      props: { ...newNode.data.props },
      name:
        typeof actualType == 'string' ? actualType : (actualType as any).name,
      displayName:
        typeof actualType == 'string' ? actualType : (actualType as any).name,
      custom: {},
      isCanvas: false,
      hidden: false,
      ...newNode.data,
    } as NodeData;

    node.related = {};

    node.events = {
      selected: false,
      dragged: false,
      hovered: false,
    };

    node.rules = {
      canDrag: () => true,
      canDrop: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
      ...((actualType.craft && actualType.craft.rules) || {}),
    };

    // @ts-ignore
    if (node.data.type === Element || node.data.type === Canvas) {
      let usingDeprecatedCanvas = node.data.type === Canvas;
      const mergedProps = {
        ...defaultElementProps,
        ...node.data.props,
      };

      Object.keys(defaultElementProps).forEach((key) => {
        node.data[elementPropToNodeData[key] || key] = mergedProps[key];
        delete node.data.props[key];
      });

      actualType = node.data.type;

      if (usingDeprecatedCanvas) {
        node.data.isCanvas = true;
        deprecateCanvasComponent();
      }
    }

    if (normalize) {
      normalize(node);
    }

    if (actualType.craft) {
      node.data.props = {
        ...(actualType.craft.props || actualType.craft.defaultProps || {}),
        ...node.data.props,
      };

      const displayName = actualType.craft.displayName || actualType.craft.name;
      if (displayName) {
        node.data.displayName = displayName;
      }

      if (actualType.craft.isCanvas) {
        node.data.isCanvas = node.data.isCanvas || actualType.craft.isCanvas;
      }

      if (actualType.craft.rules) {
        Object.keys(actualType.craft.rules).forEach((key) => {
          if (['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(key)) {
            node.rules[key] = actualType.craft.rules[key];
          }
        });
      }

      if (actualType.craft.custom) {
        node.data.custom = {
          ...actualType.craft.custom,
          ...node.data.custom,
        };
      }

      if (actualType.craft.related) {
        node.related = {};
        const relatedNodeContext = {
          id: node.id,
          related: true,
        };
        Object.keys(actualType.craft.related).forEach((comp) => {
          node.related[comp] = () =>
            React.createElement(
              NodeProvider,
              relatedNodeContext,
              React.createElement(actualType.craft.related[comp])
            );
        });
      }
    }
  }) as Node;
}
