import React from "react";

export type NodeId = string;

export interface Node  {
  id: NodeId;
  data: NodeData;
  ref: NodeRef;
  props: any;
}

export interface NodeData {
  props: any,
  type: React.ElementType;
  parent?: NodeId;
  closestParent?: NodeId;
  event: NodeEvent;
  _childCanvas?: Record<string, NodeId>
  nodes?: NodeId[]
}

export interface NodeRef {
  dom: HTMLElement;
  canDrag(node: Node): void;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
}

export interface NodeEvent {
  active?: boolean;
  dragging?: boolean;
  hover?: boolean;
}

export type ReduceCompType = string | {
  resolvedName: string
}

export type ReducedComp = {
  type: ReduceCompType
  props: any
}

export type SerializedNodeData = Omit<NodeData, 'type' | 'event'> & ReducedComp 

export type Nodes = Record<NodeId, Node>

export type ConnectedNode = {
  node: Node;
  connectTarget: Function,
  setProp: Function
} 

export type ResolverFunction = (name: string) => React.ElementType;
export type ResolverMap = Record<string, React.ElementType>;
export type Resolver = ResolverFunction | ResolverMap;
