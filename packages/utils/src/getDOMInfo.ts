export const getDOMInfo = (el: HTMLElement) => {
  const {
    x,
    y,
    top,
    left,
    bottom,
    right,
    width,
    height,
  } = el.getBoundingClientRect() as DOMRect;

  const style = window.getComputedStyle(el);

  const margin = {
    left: parseInt(style.marginLeft),
    right: parseInt(style.marginRight),
    bottom: parseInt(style.marginBottom),
    top: parseInt(style.marginTop),
  };

  const padding = {
    left: parseInt(style.paddingLeft),
    right: parseInt(style.paddingRight),
    bottom: parseInt(style.paddingBottom),
    top: parseInt(style.paddingTop),
  };

  const styleInFlow = (parent: HTMLElement) => {
    const parentStyle: any = getComputedStyle(parent);

    if (style.overflow && style.overflow !== 'visible') {
      return;
    }

    if (parentStyle.float !== 'none') {
      return;
    }

    if (parentStyle.display === 'grid') {
      return;
    }

    if (
      parentStyle.display === 'flex' &&
      parentStyle['flex-direction'] !== 'column'
    ) {
      return;
    }

    switch (style.position) {
      case 'static':
      case 'relative':
        break;
      default:
        return;
    }

    switch (el.tagName) {
      case 'TR':
      case 'TBODY':
      case 'THEAD':
      case 'TFOOT':
        return true;
    }

    switch (style.display) {
      case 'block':
      case 'list-item':
      case 'table':
      case 'flex':
      case 'grid':
        return true;
    }

    return;
  };

  return {
    x,
    y,
    top,
    left,
    bottom,
    right,
    width,
    height,
    outerWidth: Math.round(width + margin.left + margin.right),
    outerHeight: Math.round(height + margin.top + margin.bottom),
    margin,
    padding,
    inFlow: el.parentElement && !!styleInFlow(el.parentElement),
  };
};
