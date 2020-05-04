import React from "react";
import { NodeData, Node } from "../interfaces";
import { produce } from "immer";
import { Canvas, deprecateCanvasComponent } from "../nodes/Canvas";
import { Element } from "../nodes/Element";
import { NodeProvider } from "../nodes/NodeContext";
const shortid = require("shortid");

export function createNode(
  element: React.ReactElement,
  normalise: (node: Node) => void
): Node {
  let actualType = element.type as any;

  const prefix = actualType === Canvas ? "canvas" : "node";
  let id = `${prefix}-${shortid.generate()}`;

  let node = produce({}, (node: Node) => {
    node.id = id;

    node.data = {
      type: actualType,
      props: { ...element.props },
      name: (actualType as any).name,
      displayName: (actualType as any).name,
      custom: {},
    } as NodeData;

    node.related = {};

    node.events = {
      selected: false,
      dragged: false,
      hovered: false,
    };

    node.rules = {
      canDrag: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
      ...((actualType.craft && actualType.craft.rules) || {}),
    };

    // @ts-ignore
    if (node.data.type === Element || node.data.type === Canvas) {
      let usingDeprecatedCanvas = node.data.type === Canvas;
      const { is, isCanvas, custom } = node.data.props;

      node.data.type = is || "div";
      actualType = node.data.type;
      delete node.data.props["is"];
      node.data.isCanvas = isCanvas;
      delete node.data.props["isCanvas"];

      node.data.custom = custom || node.data.custom;
      delete node.data.props["custom"];

      if (usingDeprecatedCanvas) {
        node.data.isCanvas = true;
        deprecateCanvasComponent();
      }
    }

    if (actualType.craft) {
      node.data.props = {
        ...((actualType.craft && actualType.craft.defaultProps) || {}),
        ...node.data.props,
      };

      if (actualType.craft.name) {
        node.data.displayName = actualType.craft.name;
      }

      if (actualType.craft.isCanvas) {
        node.data.isCanvas = node.data.isCanvas || actualType.craft.isCanvas;
      }

      if (actualType.craft.rules) {
        Object.keys(actualType.craft.rules).forEach((key) => {
          if (["canDrag", "canMoveIn", "canMoveOut"].includes(key)) {
            node.rules[key] = actualType.craft.rules[key];
          }
        });
      }

      if (actualType.craft.custom) {
        node.data.custom = node.data.custom || actualType.craft.custom;
      }

      if (normalise) {
        normalise(node);
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

  return node;
}
