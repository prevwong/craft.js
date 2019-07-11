import { NodeId, Node } from "./nodes";

export type MonitorState = {
  nodes: Record<NodeId, NodeRef>
  events: Record<'active' | 'dragging' | 'hover', NodeId>
}

export type NodeRefEvent = Record<'active' | 'dragging'| 'hover', boolean>

export type NodeRef = {
  dom: HTMLElement;
  canDrag(node: Node): void;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
  event: NodeRefEvent
}
