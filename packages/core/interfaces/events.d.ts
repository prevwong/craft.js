import { NodeId, CanvasNode, Node } from "./nodes";

export interface NodeInfo extends DOMInfo {
  id?: NodeId;
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
  outerWidth: number;
  outerHeight: number;
  padding?: CSSMarginPaddingObj;
  margin?: CSSMarginPaddingObj;
  inFlow?: boolean;
}


export interface DropAction {
  parent: CanvasNode;
  index: number;
  where: string;
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
