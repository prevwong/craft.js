import React from "react";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData;
  event: NodeRefEvent;
  dom: HTMLElement;
  related: Record<string, React.ElementType>;
  rules: NodeRules;
  hidden?: boolean;
}

export type NodeEvents = 'active' | 'dragging' | 'hover';
export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<NodeEvents, boolean>
export type NodeRules = {
  canDrag(): boolean;
  incoming?(incoming: Node, self: Node): boolean;
  outgoing?(outgoing: Node, self: Node): boolean;
}

export type NodeData = {
  props: Record<string, any>,
  type: string | React.ElementType;
  name: string,
  displayName: string,
  isCanvas?: boolean;
  parent: NodeId;
  index?: number;
  _childCanvas?: Record<string, NodeId>
  nodes?: NodeId[]
}

export type ReduceCompType = string | {
  resolvedName: string
}

export type ReducedComp = {
  type: ReduceCompType
  isCanvas?: boolean
  props: any
}

export type SerializedNodeData = Omit<NodeData, 'type' | 'subtype' | 'name' | 'event'> & ReducedComp

export type Nodes = Record<NodeId, Node>
export type TreeNode = Node & {children?: any}

