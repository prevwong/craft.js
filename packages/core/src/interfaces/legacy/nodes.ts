import { NodeEventTypes, NodeRelated, NodeRules } from '..';
import { NodeId } from '../nodes';

export type LegacyNodeData = {
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
  _childCanvas?: Record<string, NodeId>; // TODO: Deprecate in favour of linkedNodes
};

export type LegacyNode = {
  id: NodeId;
  data: LegacyNodeData;
  rules: NodeRules;
  events: Record<NodeEventTypes, boolean>;
  related: NodeRelated;
  dom: HTMLElement;
};

export type LegacyNodes = Record<NodeId, LegacyNode>;

export type LegacyNodeTree = {
  rootNodeId: NodeId;
  nodes: LegacyNodes;
};

export interface LegacyNodeQuery extends LegacyNode {
  get: () => LegacyNode;
  toSerializedNode: () => SerializedNode;
}

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
