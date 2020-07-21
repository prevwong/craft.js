import React from 'react';
import { QueryMethods } from '../editor/query';
import { QueryCallbacksFor } from '@craftjs/utils';

type UserComponentConfig<T> = {
  displayName: string;
  rules: Partial<NodeRules>;
  related: Partial<NodeRelated>;
  props: Partial<T>;

  // TODO: Deprecate
  name: string;
  defaultProps: Partial<T>;
};

export type UserComponent<T = any> = React.ComponentType<T> & {
  craft?: Partial<UserComponentConfig<T>>;
};

export type NodeId = string;

export type Node = {
  id: NodeId;
  data: NodeData;
  events: NodeRefEvent;
  dom: HTMLElement;
  related: Record<string, React.ElementType>;
  rules: NodeRules;
  _hydrationTimestamp: number;
};

export type NodeHelpers = QueryCallbacksFor<typeof QueryMethods>['node'];
export type NodeEvents = 'selected' | 'dragged' | 'hovered';
export type NodeRefEvent = Record<NodeEvents, boolean>;
export type NodeRules = {
  canDrag(node: Node, helpers: NodeHelpers): boolean;
  canDrop(dropTarget: Node, self: Node, helpers: NodeHelpers): boolean;
  canMoveIn(canMoveIn: Node, self: Node, helpers: NodeHelpers): boolean;
  canMoveOut(canMoveOut: Node, self: Node, helpers: NodeHelpers): boolean;
};
export type NodeRelated = Record<string, React.ElementType>;

export type NodeData = {
  props: Record<string, any>;
  type: string | React.ElementType;
  name: string;
  displayName: string;
  isCanvas?: boolean;
  parent?: NodeId;
  index?: number;
  linkedNodes?: Record<string, NodeId>;
  nodes?: NodeId[];
  hidden: boolean;
  custom?: any;
  _childCanvas?: Record<string, NodeId>; // TODO: Deprecate in favour of linkedNodes
};

export type FreshNode = {
  id?: NodeId;
  data: Partial<NodeData> & Required<Pick<NodeData, 'type'>>;
};

export type ReduceCompType =
  | string
  | {
      resolvedName: string;
    };

export type ReducedComp = {
  type: ReduceCompType;
  isCanvas?: boolean;
  props: any;
};

export type SerializedNode = Omit<
  NodeData,
  'type' | 'subtype' | 'name' | 'event'
> &
  ReducedComp;

export type SerializedNodes = Record<NodeId, SerializedNode>;

// TODO: Deprecate in favor of SerializedNode
export type SerializedNodeData = SerializedNode;

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
