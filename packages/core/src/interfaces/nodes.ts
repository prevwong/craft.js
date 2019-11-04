import React from "react";
import { NodeProvider } from "nodes/NodeContext";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData;
  event: NodeRefEvent;
  dom: HTMLElement;
  related: Record<string, React.ElementType>;
  rules: NodeRules
}

export type NodeEvents = 'active' | 'dragging' | 'hover';
export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<NodeEvents, boolean>
export type NodeRules = {
  canDrag(): boolean;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
}

export type NodeData = {
  props: Record<string, any>,
  type: string | React.ElementType;
  name: string,
  subtype?: string | React.ElementType,
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
  subtype?: ReduceCompType
  props: any
}

export type SerializedNodeData = Omit<NodeData, 'type' | 'subtype' | 'name' | 'event'> & ReducedComp 

export type Nodes = Record<NodeId, Node>
export type TreeNode = Node & {children?: any}

