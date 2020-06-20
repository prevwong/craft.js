import { NodeId, Node } from './nodes';

export type NodeInfo = {
  id?: NodeId;
} & DOMInfo;

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
  parent: Node;
  index: number;
  where: string;
}

export type Placement = DropAction & {
  currentNode: Node | null;
};
