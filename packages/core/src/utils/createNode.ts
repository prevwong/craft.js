import React from 'react';
import { NodeData, NodeId, Node, NodeRef } from "../interfaces";
import produce from "immer";
import { isCanvas } from "../nodes";
import { NodeProvider } from "../nodes/NodeContext";

export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId, ref: Partial<NodeRef> = {}): Node {
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      parent: data.parent || null,
      name: null,
      props: {
        ...data.props
      }
    };

    let actualType = ( data.subtype ? data.subtype : data.type ) as any;
    node.ref = {
      dom: null,
      canDrag: () => true,
      incoming: () => true,
      outgoing: () => true,
      ...ref
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

    if ( actualType.related ) {
      node.related = {};
      Object.keys(actualType.related).forEach((comp) => {
          node.related[comp] = () => React.createElement(NodeProvider, {id, related: true}, React.createElement(actualType.related[comp])) 
      });
  }

    node.data.name = name;
  }) as Node;

  return node;
}
