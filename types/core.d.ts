import React from "react";
import { id } from "~types";
import { Node, NodeId, Nodes } from "./node";
import { CSSMarginPaddingObj } from "./dom";

export interface BuilderContextState {
  nodes: Nodes,
  active: Node,
  dragging: Node,
  setCanvasNodes: Function
  setActive: Function
  setDragging: Function
}

export interface PlaceholderInfo {
  left: number;
  top: number;
  width: number;
  height: number;
  margin: CSSMarginPaddingObj;
}

export interface ActiveElement {
  type: string;
  node: Node;
}

export declare interface CoreProps {
  tree?: Node;
}

export declare interface DropAction {
  parent: Node;
  index: number;
  where: string;
}
