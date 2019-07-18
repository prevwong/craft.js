export const getDOMInfo = (dom: HTMLElement) => {
  const {
    y,
    top,
    height,
    bottom
  } = dom.getBoundingClientRect() as DOMRect;

  return {
    y: Math.round(y),
    bottom: Math.round(bottom),
    top: Math.round(top),
    height: Math.round(height),
    outerHeight: Math.round(height + parseInt(window.getComputedStyle(dom).marginTop) + parseInt(window.getComputedStyle(dom).marginBottom)),
  };
};
