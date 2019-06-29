import { Nodes, Node } from "../nodes";

export * from "./connector";
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
