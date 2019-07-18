import React from "react";
import { CallbacksFor } from "use-methods";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData
  ref: NodeRef
}

export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<'active' | 'dragging' | 'hover', boolean>

export type NodeRef = {
  dom: HTMLElement;
  canDrag(node: Node): void;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
  event: NodeRefEvent
}


export type NodeData = {
  props: any,
  type: string | React.ElementType;
  subtype?: string | React.ElementType,
  parent?: NodeId;
  closestParent?: NodeId;
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

export type SerializedNodeData = Omit<NodeData, 'type' | 'subtype' | 'event'> & ReducedComp 

export type Nodes = Record<NodeId, Node>
export type TreeNode = Record<NodeId, Node & {children?: any}>

export type ConnectedNode<S = null> = S extends null ? {
  connectTarget: Function,
  actions: any
}  : S & {
  connectTarget: Function,
  actions: any
} 
