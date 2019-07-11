import React from "react";

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData
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

export type ConnectedNode = {
  node: Node;
  connectTarget: Function,
  setProp: Function
} 

export type ResolverFunction = (name: string) => string | React.ElementType;
export type ResolverMap = Record<string, string | React.ElementType>;
export type Resolver = ResolverFunction | ResolverMap;
