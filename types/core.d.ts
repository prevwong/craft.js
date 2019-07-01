import React from "react";
import { id } from "~types";
import { Node, NodeId, Nodes, NodeInfo, CanvasNode, NodeStates } from "./node";
import { CSSMarginPaddingObj } from "./dom";
import { NodeEvent } from "./events";

export interface BuilderState {
  nodes: Nodes
}
export interface BuilderContextState extends BuilderState {
  nodesInfo: any;
  setNodes: Function
  setNodeState: Function
  setPlaceholder: Function
}

export interface CraftAPIContext {
  nodes: Nodes, 
  add: Function, 
  move: Function, 
  active: NodeEvent, 
  dragging: NodeEvent,
  hover: NodeEvent, 
  setActive: Function
}

export interface ActiveElement {
  type: string;
  node: Node;
}

export declare interface CoreProps {
  tree?: Node;
}

export declare interface DropAction {
  parent: CanvasNode;
  index: number;
  where: string;
}
