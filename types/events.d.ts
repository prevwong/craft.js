import { Node } from "./node";
import { DOMInfo } from "./dom";

export interface EventState { 
  active: NodeEvent,
  dragging: NodeEvent,
  hover: NodeEvent,
  placeholder: NodeEvent
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

export interface NodeEvent {
  node: Node,
  info: DOMInfo
}