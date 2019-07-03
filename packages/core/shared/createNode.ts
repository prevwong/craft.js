import produce from "immer";
import { NodeId, Node, CanvasNode } from "../interfaces";
import React from "react";
import { isCanvas } from "../nodes";

export function createNode(component: React.ElementType, props: React.Props<any>, id: NodeId, parent?: NodeId): Node {
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      type: component as React.ElementType,
      props: {...props},
      parent: parent,
      closestParent: parent,
      event: {
        active: false,
        dragging: false,
        hover: false
      }
    };

    node.ref = {
      dom: null,
      canDrag: () => true,
      props: null
    };

    if ( isCanvas(node) ) {
      (node as CanvasNode).ref.incoming = () => true;
      (node as CanvasNode).ref.outgoing = () => true;
    }
  }) as Node;

  return node;
};

