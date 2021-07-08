import { NodeId } from './nodes';

export type DOMInfo = Record<
  | 'x'
  | 'y'
  | 'top'
  | 'left'
  | 'bottom'
  | 'right'
  | 'width'
  | 'height'
  | 'outerWidth'
  | 'outerHeight',
  number
> & {
  inFlow: boolean;
  margin: Record<'top' | 'left' | 'bottom' | 'right', number>;
  padding: Record<'top' | 'left' | 'bottom' | 'right', number>;
};

export interface DropAction {
  parentNodeId: NodeId;
  index: number;
  where: string;
}

export type Placement = DropAction & {
  currentNodeId: NodeId | null;
};
export interface Indicator {
  placement: Placement;
  error: string | false;
}
