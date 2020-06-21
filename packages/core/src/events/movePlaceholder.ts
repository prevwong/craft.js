import { DropAction, DOMInfo } from '../interfaces';

export default function movePlaceholder(
  pos: DropAction,
  canvasDOMInfo: DOMInfo, // which canvas is cursor at
  bestTargetDomInfo: DOMInfo | null // closest element in canvas (null if canvas is empty)
) {
  let t = 0,
    l = 0,
    w = 0,
    h = 0,
    where = pos.where;

  const elDim = bestTargetDomInfo;

  if (elDim) {
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = 2;
      h = elDim.outerHeight;
      t = elDim.top;
      l = where === 'before' ? elDim.left : elDim.left + elDim.outerWidth;
    } else {
      w = elDim.outerWidth;
      h = 2;
      t = where === 'before' ? elDim.top : elDim.bottom;
      l = elDim.left;
    }
  } else {
    if (canvasDOMInfo) {
      t = canvasDOMInfo.top + canvasDOMInfo.padding.top;
      l = canvasDOMInfo.left;
      w = canvasDOMInfo.outerWidth;
      h = 2;
    }
  }
  return {
    top: `${t}px`,
    left: `${l}px`,
    width: `${w}px`,
    height: `${h}px`,
  };
}
