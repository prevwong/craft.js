import React from "react";
import { ManagerMethods, PublicManagerMethods } from "../manager/methods";

export type NodeId = string;
export type Node = {
  id: NodeId;
  props: React.Props<any>;
  type: React.ElementType;
  parent: NodeId;
  closestParent: NodeId;
  event: NodeEvent;
  _childCanvas?: CanvasMapping
}

export interface NodeEvent {
  active?: boolean;
  dragging?: boolean;
  hover?: boolean;
}

export type Nodes = {
  [key: string]: Node
}

export interface CanvasNode extends Node {
  nodes: NodeId[]
}

export interface CanvasMapping {
  [key: string]: NodeId;
}


export type CraftNodeAPI<M extends ManagerMethods | PublicManagerMethods> = {
  node: Node;
  manager: M
  connectTarget: Function
} 


export interface ConnectedNode<M extends ManagerMethods | PublicManagerMethods> {
  craft: CraftNodeAPI<M>
}

export type ConnectedInternalNode = ConnectedNode<ManagerMethods>;
export type ConnectedPublicNode = ConnectedNode<PublicManagerMethods>;
