import { Tree } from "../src/utils";
import { Index } from "./tree";
import React from "react";
import { id } from "~types";

export declare interface CoreState {
  dragging: ActiveElement;
  active: ActiveElement;
  tree: Tree;
  setDragging: Function;
  setTree: Function;
  setPlaceholder: Function;
  setActive: Function;
  placeholder: PlaceholderInfo;
}

export interface ActiveElement {
  type: string;
  index: Index;
}

export interface CSSMarginPaddingObj {
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
}
export interface DOMInfo {
  x?: number;
  y?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
  padding?: CSSMarginPaddingObj;
  margin?: CSSMarginPaddingObj;
  inFlow?: boolean;
}

export interface PlaceholderInfo {
  position: DOMInfo;
  node: Node;
  placement: DropAction;
}

export interface NodeInfo {
  id?: number;
  dom?: DOMInfo;
  accept?: boolean;
}

export interface RenderInfo {
  [key: string]: NodeInfo;
}

export declare interface CoreProps {
  tree?: Node;
}

export declare interface DropAction {
  parent: Index;
  index: number;
  where: string;
}
