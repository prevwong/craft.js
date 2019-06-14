import React from "react";
import { id } from "~types";
import { Node, NodeId, Nodes, NodeInfo, CanvasNode, NodeStates } from "./node";
import { CSSMarginPaddingObj } from "./dom";

export interface BuilderState {
  nodes: Nodes,
  nodeStates: NodeStates,
  active: Node,
  hover: Node,
  dragging: Node,
  placeholder: PlaceholderInfo
}
export interface BuilderContextState extends BuilderState {
  nodesInfo: any;
  setNodes: Function
  setHover: Function
  setActive: Function
  setDragging: Function
  setPlaceholder: Function
}

export interface PlaceholderInfo {
  node: Node
  placement: DropAction;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    margin: CSSMarginPaddingObj;
  }
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
