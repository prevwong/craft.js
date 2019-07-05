import produce from "immer";
import { NodeId, Node, NodeData } from "../interfaces";
import { isCanvas } from "../nodes";

// TODO: Refactor createNode()
export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      event: {
        active: false,
        dragging: false,
        hover: false
      },
    };

    node.ref = {
      dom: null,
      canDrag: () => true
    };

    if ( isCanvas(node) ) {
      node.ref.incoming = () => true;
      node.ref.outgoing = () => true;
    }
  }) as Node;

  return node;
};

