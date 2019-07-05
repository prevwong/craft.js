import React from "react";
import { ManagerMethods } from "../manager/methods";
import { RenderContext } from "../render/RenderContext";

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
  _childCanvas?: CanvasMapping
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

export type ReduceCompType ={
  resolvedName: string | {name: string}
}

export type ReducedComp = {
  type: ReduceCompType
  props: any
}

export type SerializedNodeData = Omit<NodeData, 'type' | 'event'> & ReducedComp 

export type Nodes = {
  [key: string]: Node
}


export interface CanvasMapping {
  [key: string]: NodeId;
}

export type ConnectedNode = {
  node: Node;
  connectTarget: Function,
  setProp: Function
} 