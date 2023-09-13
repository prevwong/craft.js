import { QueryCallbacksFor } from '@craftjs/utils';
import React from 'react';
import { QueryMethods } from '../editor/query';
export declare type UserComponentConfig<T> = {
  displayName: string;
  rules: Partial<NodeRules>;
  related: Partial<NodeRelated>;
  props: Partial<T>;
  custom: Record<string, any>;
  isCanvas: boolean;
  name: string;
  defaultProps: Partial<T>;
};
export declare type UserComponent<T = any> = React.ComponentType<T> & {
  craft?: Partial<UserComponentConfig<T>>;
};
export declare type NodeId = string;
export declare type NodeEventTypes = 'selected' | 'dragged' | 'hovered';
export declare type Node = {
  id: NodeId;
  data: NodeData;
  events: Record<NodeEventTypes, boolean>;
  dom: HTMLElement | null;
  related: Record<string, React.ElementType>;
  rules: NodeRules;
  _hydrationTimestamp: number;
};
export declare type NodeHelpersType = QueryCallbacksFor<
  typeof QueryMethods
>['node'];
export declare type NodeRules = {
  canDrag(node: Node, helpers: NodeHelpersType): boolean;
  canDrop(dropTarget: Node, self: Node, helpers: NodeHelpersType): boolean;
  canMoveIn(canMoveIn: Node[], self: Node, helpers: NodeHelpersType): boolean;
  canMoveOut(canMoveOut: Node[], self: Node, helpers: NodeHelpersType): boolean;
};
export declare type NodeRelated = Record<string, React.ElementType>;
export declare type NodeData = {
  props: Record<string, any>;
  type: string | React.ElementType;
  name: string;
  displayName: string;
  isCanvas: boolean;
  parent: NodeId;
  linkedNodes: Record<string, NodeId>;
  nodes: NodeId[];
  hidden: boolean;
  custom?: any;
  _childCanvas?: Record<string, NodeId>;
};
export declare type FreshNode = {
  id?: NodeId;
  data: Partial<NodeData> & Required<Pick<NodeData, 'type'>>;
};
export declare type ReduceCompType =
  | string
  | {
      resolvedName: string;
    };
export declare type ReducedComp = {
  type: ReduceCompType;
  isCanvas: boolean;
  props: any;
};
export declare type SerializedNode = Omit<
  NodeData,
  'type' | 'subtype' | 'name' | 'event'
> &
  ReducedComp;
export declare type SerializedNodes = Record<NodeId, SerializedNode>;
export declare type SerializedNodeData = SerializedNode;
export declare type Nodes = Record<NodeId, Node>;
/**
 * A NodeTree is an internal data structure for CRUD operations that involve
 * more than a single node.
 *
 * For example, when we drop a component we use a tree because we
 * need to drop more than a single component.
 */
export interface NodeTree {
  rootNodeId: NodeId;
  nodes: Nodes;
}
declare type NodeIdSelector = NodeId | NodeId[];
declare type NodeObjSelector = Node | Node[];
export declare enum NodeSelectorType {
  Any = 0,
  Id = 1,
  Obj = 2,
}
export declare type NodeSelector<
  T extends NodeSelectorType = NodeSelectorType.Any
> = T extends NodeSelectorType.Id
  ? NodeIdSelector
  : T extends NodeSelectorType.Obj
  ? NodeObjSelector
  : NodeIdSelector | NodeObjSelector;
export declare type NodeSelectorWrapper = {
  node: Node;
  exists: boolean;
};
export {};
