import { HTMLProps } from "react";
import { id } from "~types";
import React from "react"
import { DOMInfo, CSSMarginPaddingObj } from "./dom";

export type NodeId = string;

export interface TempNode {
  type?: string | React.ElementType;
  props?: HTMLProps<any>;
}
export interface Node {
  type?: string | React.ElementType;
  props?: HTMLProps<any>;
  id?: NodeId;
  info?: NodeInfo;
  childCanvas?: CanvasMapping;
  parent?: string;
}

export interface CanvasMapping {
  [key: string]: NodeId;
}

export interface CanvasNode extends Node {
  nodes?: NodeId[]
  incoming?: Function;
  outgoing?: Function;
}

export interface Nodes {
  [key: string]: Node
}
export interface CanvasNodes {
  [key: string]: CanvasNode
}

export interface NodeInfo {
  id?: id;
  dom?: DOMInfo;
  accept?: boolean;
}
