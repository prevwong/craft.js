import React from "react";
import { ManagerMethods, PublicManagerMethods } from "../manager/methods";
import { RenderContext } from "../render/RenderContext";

export type NodeId = string;

export interface Node  {
  id: NodeId;
  data: NodeData;
  ref: NodeRef;
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


export type CraftNodeAPI<M extends ManagerMethods | PublicManagerMethods> = {
  node: Node;
  manager: M
  connectTarget: Function
} 


export type ConnectedNode<M extends ManagerMethods | PublicManagerMethods> = {
  craft: CraftNodeAPI<M>
}

export type ConnectedInternalNode = {
  renderer: RenderContext;
} & ConnectedNode<ManagerMethods>

export type ConnectedPublicNode = ConnectedNode<PublicManagerMethods>;
