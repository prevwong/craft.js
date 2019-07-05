import { DropAction, DOMInfo } from "../interfaces";

export default function movePlaceholder(
  pos: DropAction,
  canvasDOMInfo: DOMInfo, // which canvas is cursor at
  bestTargetDomInfo: DOMInfo // closest element in canvas (null if canvas is empty)
) {
  let t = 0,
    l = 0,
    w = 0,
    h = 0,
    where = pos.where;

  const elDim = bestTargetDomInfo ? bestTargetDomInfo : null;


  if (elDim) {
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = null;
      h = elDim.outerHeight * 2;
      t = elDim.top;
      l =
        where == "before" ? elDim.left : elDim.left + elDim.outerWidth;
    } else {
      w = elDim.outerWidth;
      h = null;
      t =
        where == "before" ? elDim.top : elDim.top + elDim.outerHeight;
      l = elDim.left;
    }
  } else {
    if (canvasDOMInfo) {
      t = canvasDOMInfo.top;
      l = canvasDOMInfo.left;
      w = canvasDOMInfo.outerWidth * 2;
      h = null;
    }
  }

  return {
    top: t + window.scrollY,
    left: l + window.scrollX,
    width: w,
    height: h
  };
}
