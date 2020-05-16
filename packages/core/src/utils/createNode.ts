import React from "react";
import { NodeData, NodeId, Node } from "../interfaces";
import { produce } from "immer";
import { Canvas } from "../nodes/Canvas";
import { NodeProvider } from "../nodes/NodeContext";

export function createNode(
  data: Partial<NodeData> & Pick<NodeData, "type" | "props">,
  id: NodeId
): Node {
  let actualType = data.type as any;
  const { canMoveIn, canMoveOut, ...props } = data.props;

  return produce({}, (node: Node) => {
    node.id = id;

    node.data = {
      ...data,
      name: (data.type as any).name,
      displayName: (data.type as any).name,
      props,
      custom: data.custom || {},
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

    if (node.data.type === Canvas) {
      node.data.type = node.data.props.is ? node.data.props.is : "div";
      node.data.isCanvas = true;
      actualType = node.data.type;
      delete node.data.props["is"];
    }

    node.data.props = {
      ...((actualType.craft && actualType.craft.defaultProps) || {}),
      ...node.data.props,
    };

    if (actualType.craft) {
      if (actualType.craft.name) {
        node.data.displayName = actualType.craft.name;
      }

      if (actualType.craft.isCanvas) {
        node.data.isCanvas = true;
      }

      if (actualType.craft.rules) {
        Object.keys(actualType.craft.rules).forEach((key) => {
          if (["canDrag", "canMoveIn", "canMoveOut"].includes(key)) {
            node.rules[key] = actualType.craft.rules[key];
          }
        });
      }
      if (actualType.craft.related) {
        node.related = {};
        Object.keys(actualType.craft.related).forEach((comp) => {
          node.related[comp] = () =>
            React.createElement(
              NodeProvider,
              { id, related: true },
              React.createElement(actualType.craft.related[comp])
            );
        });
      }
    }
  }) as Node;
}
