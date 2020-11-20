import { Range, Point } from 'slate';

const isPointAtRoot = (point: Point) => point.path.length === 2;

export const isRangeAtRoot = (range: Range) =>
  isPointAtRoot(range.anchor) || isPointAtRoot(range.focus);
