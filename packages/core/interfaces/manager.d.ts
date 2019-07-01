import { Nodes, Node } from "./nodes";

export type Events = {
  active: Node,
  dragging: Node,
  hover: Node
}

export type ManagerState = {
  nodes: Nodes,
  events: Events
}