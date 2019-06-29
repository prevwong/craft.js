import React from "react";

export type NodeId = string;
export type Node = {
  id: NodeId;
  props: React.Props<any>;
  type: React.ElementType;
  parent: NodeId;
  closestParent: NodeId;
  _childCanvas?: CanvasMapping
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

