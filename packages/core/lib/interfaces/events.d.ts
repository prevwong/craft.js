import { NodeId, Node, NodeTree } from './nodes';
export declare type NodeInfo = {
  id: NodeId;
} & DOMInfo;
export declare type DOMInfo = Record<
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
export interface DropPosition {
  parent: Node;
  index: number;
  where: string;
}
export declare type Placement = DropPosition & {
  currentNode: Node | null;
};
declare type ExistingDragTarget = {
  type: 'existing';
  nodes: NodeId[];
};
declare type NewDragTarget = {
  type: 'new';
  tree: NodeTree;
};
export declare type DragTarget = ExistingDragTarget | NewDragTarget;
export {};
