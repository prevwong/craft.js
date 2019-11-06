import React from 'react';
import { NodeData, NodeId, Node, NodeRules } from "../interfaces";
import produce from "immer";
import { isCanvas } from "../nodes";
import { NodeProvider } from "../nodes/NodeContext";

export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {
 
  let actualType = (data.subtype ? data.subtype : data.type) as any;
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      parent: data.parent || null,
      name: null,
      props: {
        ...data.props,
      }
    };


    node.rules = {
      canDrag: () => true,
      incoming: () => true,
      outgoing: () => true
    }

    node.event = {
      active: false,
      dragging: false,
      hover: false
    }

    if (isCanvas(node)) {
      node.data.subtype = data.subtype ? data.subtype : node.data.props.is ? node.data.props.is : 'div';
      actualType = node.data.subtype;
    }

    node.data.props = {
      ...((actualType.craft && actualType.craft.defaultProps) || {}),
      ...node.data.props,
    }

    if ( actualType.craft ) {
      if ( actualType.craft.rules ) {
        Object.keys(actualType.craft.rules).forEach(key => {
          if (['canDrag', 'incoming', 'outgoing'].includes(key)) {
            node.rules[key] = actualType.craft.rules[key];
          } 
        });
      } 
      if ( actualType.craft.related ) {
        node.related = {}
        Object.keys(actualType.craft.related).forEach((comp) => {
          node.related[comp] = () => React.createElement(NodeProvider, { id, related: true }, React.createElement(actualType.craft.related[comp]))
        });
      }
    }

    node.data.name = name;
  }) as Node;

  console.log("Create", node, actualType.craft)
  return node;
}
