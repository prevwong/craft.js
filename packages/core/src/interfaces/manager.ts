import { Nodes, Node } from "./nodes";
import { PlaceholderInfo } from "../dnd/interfaces";
import { useInternalManager } from "../manager/useInternalManager";

export type ManagerEvents = Record<'active' | 'dragging' | 'hover', Node> & {
  placeholder: PlaceholderInfo
  pending: Node
}

export type ManagerState = {
  nodes: Nodes,
  events: ManagerEvents
}

export type ConnectedManager<S = null> = useInternalManager<S>;
