import { NodeEventTypes, NodeRelated, NodeRules } from '..';
import { NodeId, Node, NodeTree } from '../nodes';

export type LegacyNodeData = {
  /**
   * @deprecated
   */
  props: Record<string, any>;
  /**
   * @deprecated
   */
  type: string | React.ElementType;
  /**
   * @deprecated
   */
  name: string;
  /**
   * @deprecated
   */
  displayName: string;
  /**
   * @deprecated
   */
  isCanvas: boolean;
  /**
   * @deprecated
   */
  parent: NodeId;
  /**
   * @deprecated
   */
  linkedNodes: Record<string, NodeId>;
  /**
   * @deprecated
   */
  nodes: NodeId[];
  /**
   * @deprecated
   */
  hidden: boolean;
  /**
   * @deprecated
   */
  custom?: any;
  /**
   * @deprecated
   */
  _childCanvas?: Record<string, NodeId>; // TODO: Deprecate in favour of linkedNodes
};

export type LegacyNode = {
  id: NodeId;
  /**
   * @deprecated
   */
  data: LegacyNodeData;
  /**
   * @deprecated
   */
  rules: NodeRules;
  /**
   * @deprecated
   */
  events: Record<NodeEventTypes, boolean>;
  /**
   * @deprecated
   */
  related: NodeRelated;
  /**
   * @deprecated
   */
  dom: HTMLElement;
};

export type BackwardsCompatibleNode = Node & LegacyNode;

export type LegacyNodes = Record<NodeId, LegacyNode>;

export type LegacyNodeTree = {
  rootNodeId: NodeId;
  nodes: LegacyNodes;
};

export type BackwardsCompatibleNodeTree = {
  rootNodeId: NodeTree['rootNodeId'];
  nodes: Record<NodeId, LegacyNode | Node>;
};

export type FreshNode = {
  id?: NodeId;
  data: Partial<LegacyNodeData> & Required<Pick<LegacyNodeData, 'type'>>;
};

export type ReduceCompType =
  | string
  | {
      resolvedName: string;
    };

export type ReducedComp = {
  type: ReduceCompType;
  isCanvas: boolean;
  props: any;
};

export type SerializedNode = Omit<LegacyNodeData, 'type' | 'name' | 'event'> &
  ReducedComp;

export type SerializedNodes = Record<NodeId, SerializedNode>;
