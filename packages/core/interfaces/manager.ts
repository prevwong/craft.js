import { Nodes, Node } from "./nodes";
import { useCollector } from "../shared/useCollector";
import { PlaceholderInfo } from "../dnd/interfaces";


export type ManagerState = {
  nodes: Nodes,
  events: {
    active: Node,
    selected: Node,
    dragging: Node,
    hover: Node,
    placeholder: PlaceholderInfo
  }
}

export type ConnectedManager<S = null> = useCollector<S>;
