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
  props: React.Props<any>;
  type: React.ElementType;
  parent: NodeId;
  closestParent: NodeId;
  event: NodeEvent;
  _childCanvas?: CanvasMapping
}

export interface CanvasNode extends Node {
  data: CanvasNodeData;
  ref: CanvasNodeRef
}

export interface CanvasNodeData extends NodeData {
  nodes: NodeId[]
}

export interface NodeRef {
  dom: HTMLElement;
  props: any
  canDrag(node: Node): void;
}

export interface CanvasNodeRef extends NodeRef {
  incoming(incoming: Node): boolean;
  outgoing(outgoing: Node): boolean;
}

export interface NodeEvent {
  active?: boolean;
  dragging?: boolean;
  hover?: boolean;
}

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

