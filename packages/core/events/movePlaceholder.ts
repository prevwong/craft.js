import { DropAction, DOMInfo } from "../interfaces";

export default function movePlaceholder(
  pos: DropAction,
  canvasDOMInfo: DOMInfo, // which canvas is cursor at
  bestTargetDomInfo: DOMInfo // closest element in canvas (null if canvas is empty)
) {
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
