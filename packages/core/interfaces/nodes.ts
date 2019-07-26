import React from "react";
import { CallbacksFor } from "use-methods";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData;
  event: NodeRefEvent;
  ref: NodeRef;
}

export type NodeToAdd = {
  node: Node,
  index?: number
}

export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<'active' | 'dragging' | 'hover', boolean>

export type NodeRef = {
  dom: HTMLElement;
  canDrag(): boolean;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
}


export type NodeData = {
  props: any,
  type: string | React.ElementType;
  name: string,
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

export type SerializedNodeData = Omit<NodeData, 'type' | 'subtype' | 'name' | 'event'> & ReducedComp 

export type Nodes = Record<NodeId, Node>
export type TreeNode = Node & {children?: any}

export type ConnectedNode<S = null> = S extends null ? {
  connectTarget: Function,
  actions: any
}  : S & {
  connectTarget: Function,
  actions: any
} 
