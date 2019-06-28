import React from "react";

export type NodeId = string;
export interface Node {
  id: NodeId;
  props: React.Props<any>;
  type: React.ElementType;
  parent: NodeId;
  closestParent: NodeId;
  _childCanvas?: NodeId[]
}

export interface CanvasNode extends Node {
  nodes: NodeId[]
}