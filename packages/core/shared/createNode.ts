import produce from "immer";
import { NodeId, Node, NodeData } from "../interfaces";
import { isCanvas } from "../nodes";

// TODO: Refactor createNode()
export function createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {
  let node = produce({}, (node: Node) => {
    node.id = id;
    node.data = {
      ...data,
      props: {
        ...data.props
      }
    };

    node.ref = {
      event: {
        active:false,
        dragging: false,
        hover: false
      },
      dom: null,
      canDrag: () => {}
    }

    if ( isCanvas(node) ) {
      node.data.subtype = data.subtype ? data.subtype : node.data.props.is ? node.data.props.is : 'div';
      delete node.data.props['is'];
      node.ref.incoming = () => true;
      node.ref.outgoing = () => true;
    }
  }) as Node;

  return node;
};

