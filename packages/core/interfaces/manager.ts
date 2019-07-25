import { Nodes, Node } from "./nodes";
import { PlaceholderInfo } from "../dnd/interfaces";
import { useManagerCollector } from "../manager/useManagerCollector";

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

export type ConnectedManager<S = null> = useManagerCollector<S>;
