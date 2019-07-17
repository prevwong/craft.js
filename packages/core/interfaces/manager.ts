import { Nodes, Node } from "./nodes";
import { useCollector } from "../shared/useCollector";


export type ManagerState = {
  nodes: Nodes,
  events: {
    active: Node,
    dragging: Node,
    hover: Node
  }
}

export type ConnectedManager<S = null> = useCollector<S>;
