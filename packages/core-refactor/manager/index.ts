import { Nodes, Node } from "../nodes";

export * from "./connectManager";
export * from "./context";

export type Events = {
  active: Node,
  dragging: Node,
  hover: Node
}

export type ManagerState = {
  nodes: Nodes,
  events: Events
}
