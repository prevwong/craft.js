export const isPercentage = (val: string) => typeof val == 'string' && val.indexOf('%') > -1

export const percentToPx = (value: any, comparativeValue: number) => {
  if ( typeof value === 'number' ) return;
  const percent = parseInt(value);
  // console.log("percent", percent)
  return (percent / 100 * comparativeValue);
}
export const pxToPercent = (value: number, comparativeValue: number) => {
  return (value / comparativeValue * 100)
}
export const measurementToPx = (value: string, dom: HTMLElement, dim: 'width' | 'height') => {
  if ( isPercentage(value) ) {
    const styles = getComputedStyle(dom.parentElement);
    const dimValue = dom.parentElement.getBoundingClientRect()[dim] - parseInt(styles[dim == 'width' ? 'paddingLeft' : 'paddingTop']) - parseInt(styles[dim == 'width' ? 'paddingRight' : 'paddingBottom']);
    const px = percentToPx(value, dimValue);
    return px;
  } else {
    return parseInt(value);
  }
  // return value;
}
