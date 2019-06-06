import { HTMLProps } from "react";
import { id } from "~types";
import React from "react"

export type NodeId = string;

export interface Node {
  id?: NodeId;
  name?: string;
  info?: NodeInfo;
  component?: React.ElementType;
  props?: HTMLProps<any>;
  childCanvas?: string[];
  unvisitedChildCanvas?: string[];
  children?: Node[];
  parent?: string;
}

export interface CanvasNode extends Node {
  nodes?: NodeId[]
  incoming?: Function;
  outgoing?: Function
}

export interface Nodes {
  [key: string]: Node
}

export interface CanvasNode {
  info?: NodeInfo;
  nodes?: NodeId[];
}

export interface CanvasNodes {
  [key: string]: CanvasNode
}

export interface Index {
  id?: number;
  node?: Node;
  children?: number[];
  parent?: number;
  prev?: number;
  next?: number;
  i?: number;
  [key: number]: Index;
}

export interface CSSMarginPaddingObj {
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
}

export interface DOMInfo {
  x: number;
  y: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  padding?: CSSMarginPaddingObj;
  margin?: CSSMarginPaddingObj;
  inFlow?: boolean;
}

export interface PlaceholderInfo {
  left: number;
  top: number;
  width: number;
  height: number;
  margin: CSSMarginPaddingObj;
}
export interface NodeInfo {
  id?: id;
  dom?: DOMInfo;
  accept?: boolean;
}
