import { DropAction } from ".";
import { CanvasNode, NodeId } from "../nodes";

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

export const movePlaceholder = (
  pos: DropAction,
  canvasDOMInfo: DOMInfo, // which canvas is cursor at
  bestTargetDomInfo: DOMInfo // closest element in canvas (null if canvas is empty)
) => {
  let marg = 0,
    t = 0,
    l = 0,
    w = 0,
    h = 0,
    margin = {},
    margI = 5,
    brd = 3,
    where = pos.where;

  const elDim = bestTargetDomInfo ? bestTargetDomInfo : null;

  margin = {
    top: -brd,
    left: 0,
    bottom: 0,
    right: 0
  };

  if (elDim) {
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = null;
      h = elDim.outerHeight - marg * 2;
      t = elDim.top + marg;
      l =
        where == "before" ? elDim.left - marg : elDim.left + elDim.outerWidth - marg;
      margin = {
        top: 0,
        left: -brd,
        bottom: 0,
        right: 0
      };
    } else {
      w = elDim.outerWidth;
      h = null;
      t =
        where == "before" ? elDim.top - marg : elDim.top + elDim.outerHeight - marg;
      l = elDim.left;
    }
  } else {
    if (canvasDOMInfo) {
      t = canvasDOMInfo.top + margI;
      l = canvasDOMInfo.left + margI;
      w = canvasDOMInfo.outerWidth - margI * 2;
      h = null;
    }
  }

  return {
    top: t + window.scrollY,
    left: l + window.scrollX,
    width: w,
    height: h,
    margin
  };
}

export const findPosition = (
  parent: CanvasNode,
  dims: NodeInfo[],
  posX: number,
  posY: number
) => {
  let result: DropAction = {
    parent,
    index: 0,
    where: "before"
  };

  let leftLimit = 0,
    xLimit = 0,
    dimRight = 0,
    yLimit = 0,
    xCenter = 0,
    yCenter = 0,
    dimDown = 0,
    dim = null,
    id = null;
  // Each dim is: Top, Left, Height, Width
  for (var i = 0, len = dims.length; i < len; i++) {
    dim = dims[i];
    id = dims[i].id as NodeId;

    // Right position of the element. Left + Width
    dimRight = dim.left + dim.outerWidth;
    // Bottom position of the element. Top + Height
    dimDown = dim.top + dim.outerHeight;
    // X center position of the element. Left + (Width / 2)
    xCenter = dim.left +   dim.outerWidth / 2;
    // Y center position of the element. Top + (Height / 2)
    yCenter = dim.top +  dim.outerHeight / 2;
    // Skip if over the limits
    if (
      (xLimit && dim.left > xLimit) ||
      (yLimit && yCenter >= yLimit) || // >= avoid issue with clearfixes
      (leftLimit && dimRight < leftLimit)
    )
      continue;

    result.index = i;
    // If it's not in flow (like 'float' element)
    if (!dim.inFlow) {
      if (posY < dimDown) yLimit = dimDown;
      //If x lefter than center
      if (posX < xCenter) {
        xLimit = xCenter;
        result.where = "before";
      } else {
        leftLimit = xCenter;
        result.where = "after";
      }
    } else {
      // If y upper than center
      if (posY < yCenter) {
        result.where = "before";
        break;
      } else result.where = "after"; // After last element
    }
  }

  return result;
}