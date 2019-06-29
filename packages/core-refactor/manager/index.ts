import { Nodes, Node, NodeId } from "../nodes";

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
  dom: DOMMapping
}
export type DOMMapping = {
  [key: string]: HTMLElement
}