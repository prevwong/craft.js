import { HTMLProps } from "react";
import { id } from "~types";
import React from "react"
import { DOMInfo, CSSMarginPaddingObj } from "./dom";
import { BuilderContextState } from "./core";

export type NodeId = string;


export interface NodeElementProps {
  node: Node
}

interface NodeElementState {
  childCanvas: CanvasMapping
}

export interface NodeContextState extends NodeElementState {
  node: Node;
  pushChildCanvas: Function;
  builder: BuilderContextState
}

export interface ReactElement {
  type?: string | React.ElementType;
  props?: HTMLProps<any>;
}

export interface Node extends ReactElement {
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
