import React from 'react';
import { NodeData, NodeId, Node, NodeRules } from "../interfaces";
import {produce, original} from "immer";
import { isCanvas, Canvas } from "../nodes";
import { NodeProvider } from "../nodes/NodeContext";

export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {

  let actualType = (data.type) as any;
  const {canMoveIn, canMoveOut, ...props} = data.props;

  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      parent: data.parent || null,
      name: null,
      displayName: null,
      props,
      custom: {}
    };

    node.related = {};

    node.events = {
      selected: false,
      dragged: false,
      hovered: false
    }

    node.rules = {
      canDrag: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
      ...((actualType.craft && actualType.craft.rules) || {}),
    };

    if (node.data.type === Canvas) {
      node.data.type = node.data.props.is ? node.data.props.is : 'div';
      node.data.isCanvas = true;
      actualType = node.data.type;
      node.rules = {
        ...node.rules,
        canMoveIn: canMoveIn ? canMoveIn : node.rules.canMoveIn,
        canMoveOut: canMoveOut ? canMoveOut : node.rules.canMoveOut,
      }
      delete node.data.props["is"]
    }

    node.data.props = {
      ...((actualType.craft && actualType.craft.defaultProps) || {}),
      ...node.data.props,
    }

    // Object.keys(node.rules).forEach(key => {
    //   if (['canDrag', 'canMoveIn', 'canMoveOut'].includes(key)) {
    //       if ( node.rules[key] ) node.rules[key] = node.rules[key];
    //   }
    // });
    

    if ( actualType.craft ) {
      if ( actualType.craft.name ) {
        node.data.displayName = actualType.craft.name;
      }
      if ( actualType.craft.related) {
        node.related = {}
        Object.keys(actualType.craft.related).forEach((comp) => {
          node.related[comp] = () => React.createElement(NodeProvider, { id, related: true }, React.createElement(actualType.craft.related[comp]))
        });
      }
    }

  }) as Node;

  return node;
}
