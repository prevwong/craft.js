import { NodeData, NodeId, Node, NodeRef } from "../interfaces";
import produce from "immer";
import { isCanvas } from "../nodes";

export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId, ref: Partial<NodeRef> = {}): Node {
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      name: null,
      props: {
        ...data.props
      }
    };
    if (!node.data.closestParent) node.data.closestParent = node.data.parent;
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
      // node.data.nodes = [];
      node.data.subtype = data.subtype ? data.subtype : node.data.props.is ? node.data.props.is : 'div';
    }

    node.data.name = name;
  }) as Node;

  return node;
}