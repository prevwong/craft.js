import { NodeQuery } from '../store';
import React from 'react';

export type UserComponentConfig<T> = {
  displayName: string;
  rules: Partial<NodeRules>;
  related: Partial<NodeRelated>;
  props: Partial<T>;
  custom: Record<string, any>;
  isCanvas: boolean;
};

export type UserComponent<T = any> = React.ComponentType<T> & {
  craft?: Partial<UserComponentConfig<T>>;
};

export type NodeId = string;
export type NodeEventTypes = 'selected' | 'dragged' | 'hovered';

export type Node = {
  id: NodeId;
  type: string;
  props: Record<string, any>;
  displayName: string;
  isCanvas: boolean;
  parent: NodeId;
  linkedNodes: Record<string, NodeId>;
  nodes: NodeId[];
  hidden: boolean;
  custom?: any;
};

export type NodeHelpersType = (id: NodeId) => NodeQuery;
export type NodeRules = {
  canDrag(node: NodeQuery, helpers: NodeHelpersType): boolean;
  canDrop(
    dropTarget: NodeQuery,
    self: NodeQuery,
    helpers: NodeHelpersType
  ): boolean;
  canMoveIn(
    canMoveIn: NodeQuery[],
    self: NodeQuery,
    helpers: NodeHelpersType
  ): boolean;
  canMoveOut(
    canMoveOut: NodeQuery[],
    self: NodeQuery,
    helpers: NodeHelpersType
  ): boolean;
};
export type NodeRelated = Record<string, React.ElementType>;

export type Nodes = Record<NodeId, Node>;

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

type NodeIdSelector = NodeId | NodeId[];
type NodeObjSelector = Node | Node[];

export enum NodeSelectorType {
  Any,
  Id,
  Obj,
}

export type NodeSelector<
  T extends NodeSelectorType = NodeSelectorType.Any
> = T extends NodeSelectorType.Id
  ? NodeIdSelector
  : T extends NodeSelectorType.Obj
  ? NodeObjSelector
  : NodeIdSelector | NodeObjSelector;

export type NodeSelectorWrapper = {
  node: Node;
  exists: boolean;
};
