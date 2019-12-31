import React from "react";
import { QueryMethods } from "../editor/query";
import { QueryCallbacksFor } from "@craftjs/utils";

type UserComponentConfig<T> = {
  name: string;
  rules: Partial<NodeRules>;
  related: Partial<NodeRelated>;
  defaultProps: Partial<T>
}

export type UserComponent<T = any> = React.ComponentType<T> & {
  craft?: Partial<UserComponentConfig<T>>
}

export type NodeId = string;

export type Node =  {
  id: NodeId;
  data: NodeData;
  events: NodeRefEvent;
  dom: HTMLElement;
  related: Record<string, React.ElementType>;
  rules: NodeRules;
}

export type NodeHelpers =  QueryCallbacksFor<typeof QueryMethods>['node'];
export type NodeEvents = 'selected' | 'dragged' | 'hovered';
export type InternalNode = Pick<Node, 'id'> & NodeData
export type NodeRefEvent = Record<NodeEvents, boolean>
export type NodeRules = {
  canDrag(node: Node, helpers: NodeHelpers): boolean;
  canMoveIn(canMoveIn: Node, self: Node, helpers: NodeHelpers): boolean;
  canMoveOut(canMoveOut: Node, self: Node, helpers: NodeHelpers): boolean;
}
export type NodeRelated = Record<string, React.ElementType>;

export type NodeData = {
  props: Record<string, any>,
  type: string | React.ElementType;
  name: string,
  displayName: string,
  isCanvas?: boolean;
  parent: NodeId;
  index?: number;
  _childCanvas?: Record<string, NodeId>
  nodes?: NodeId[];
  hidden: boolean;
  custom?: any;
}

export type ReduceCompType = string | {
  resolvedName: string
}

export type ReducedComp = {
  type: ReduceCompType
  isCanvas?: boolean
  props: any
}

export type SerializedNodeData = Omit<NodeData, 'type' | 'subtype' | 'name' | 'event'> & ReducedComp

export type Nodes = Record<NodeId, Node>
export type TreeNode = Node & {children?: any}

