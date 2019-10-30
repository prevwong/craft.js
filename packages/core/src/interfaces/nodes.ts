import React from "react";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData;
  event: NodeRefEvent;
  ref: NodeRef;
  related: Record<string, React.ElementType>
}

export type NodeEvents = 'active' | 'dragging' | 'hover';
export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<NodeEvents, boolean>

export type NodeRef = {
  dom: HTMLElement;
  canDrag(): boolean;
  incoming?(incoming: Node): boolean;
  outgoing?(outgoing: Node): boolean;
  getSettings?(): JSX.Element;
}


export type NodeData = {
  props: any,
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


type ConnectedNodeShared = {
  connectTarget: Function,
  connectDragHandler: Function,
  actions: any,
  _inNodeContext: boolean
}

export type ConnectedNode<S = null> = S extends null ? ConnectedNodeShared : S & ConnectedNodeShared