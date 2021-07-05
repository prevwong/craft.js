import { History, Store } from '@craftjs/utils';

import { EditorEvents, Indicator } from './editor';
import { LegacyStateOptions } from './legacy/editor';
import {
  FreshNode,
  LegacyNode,
  SerializedNode,
  SerializedNodes,
} from './legacy/nodes';
import {
  Node,
  NodeEventTypes,
  NodeId,
  NodeRules,
  NodeSelector,
  NodeTree,
} from './nodes';

import { CoreEventHandlers } from '../events';
import { EditorState, Resolver } from '../interfaces';
import { RelatedComponents } from '../nodes/RelatedComponents';
import { ActionMethods } from '../store/actions';

export interface LegacyNodeQuery extends LegacyNode {
  /**
   * @deprecated
   */
  get: () => LegacyNode;
  /**
   * @deprecated
   */
  toSerializedNode: () => SerializedNode;
  /**
   * @deprecated
   */
  ancestors: (deep?: boolean) => NodeId[];
  /**
   * @deprecated
   */
  descendants: (deep?: boolean) => NodeId[];
  /**
   * @deprecated
   */
  linkedNodes: () => NodeId[];
  /**
   * @deprecated
   */
  childNodes: () => NodeId[];
  /**
   * @deprecated
   */
  isTopLevelCanvas: () => boolean;
}

export interface NodeQuery extends LegacyNodeQuery {
  type: string;
  props: Record<string, any>;
  custom: Record<string, any>;

  getState: () => Node;
  getParent: () => NodeQuery;
  getAncestors: () => NodeQuery[];
  getDescendants: () => NodeQuery[];
  getComponent: () => React.ElementType;
  getDOM: () => HTMLElement;
  getRules: () => NodeRules;
  getRelated: () => Record<string, React.ElementType>;
  getLinkedNodes: () => { id: string; node: NodeQuery }[];
  getChildNodes: () => NodeQuery[];
  getChildAtIndex: (index: number) => NodeQuery;
  isRoot: () => boolean;
  isCanvas: () => boolean;
  isLinkedNode: () => boolean;
  isTopLevelNode: () => boolean;
  isDeletable: () => boolean;
  isParentOfTopLevelNodes: () => boolean;
  isSelected: () => boolean;
  isHovered: () => boolean;
  isDragged: () => boolean;
  isDraggable: (onError?: (err: string) => void) => boolean;
  isDroppable: (
    selector: NodeSelector,
    onError?: (err: string) => void
  ) => boolean;
  toNodeTree: () => NodeTree;
}

export interface LegacyEventQuery {
  /**
   * @deprecated
   */
  first: () => NodeId;
  /**
   * @deprecated
   */
  last: () => NodeId;
  /**
   * @deprecated
   */
  all: () => NodeId[];
  /**
   * @deprecated
   */
  at: (index: number) => NodeId;
}

export interface EventQuery extends LegacyEventQuery {
  get: () => Set<NodeId>;
  contains: (id: NodeId) => boolean;
  isEmpty: () => boolean;
  size: () => number;
  getNodeAtIndex: (index: number) => NodeQuery;
  getFirst: () => NodeQuery;
  getLast: () => NodeQuery;
}

export interface LegacyEditorQuery {
  /**
   * @deprecated
   */
  nodes: Record<NodeId, NodeQuery>;
  /**
   * @deprecated
   */
  events: EditorEvents;
  /**
   * @deprecated
   */
  options: LegacyStateOptions;
  /**
   * @deprecated
   */
  indicator: Indicator;

  /**
   * @deprecated
   */
  getEvent: (type: NodeEventTypes) => EventQuery;

  /**
   * @deprecated
   */
  getOptions(): LegacyStateOptions;
  /**
   * @deprecated
   */
  getSerializedNodes(): SerializedNodes;
  /**
   * @deprecated
   */
  serialize(): string;
  /**
   * @deprecated
   */
  parseReactElement(element: React.ReactElement);
  /**
   * @deprecated
   */
  parseSerializedNode(serializedNode: SerializedNode);
  /**
   * @deprecated
   */
  parseFreshNode(freshNode: FreshNode);
}

export interface EditorQuery extends LegacyEditorQuery {
  root: NodeQuery;
  isEnabled: () => boolean;
  node: (id: NodeId) => NodeQuery;
  event: (type: NodeEventTypes) => EventQuery;
  getState: () => EditorState;
  getDropPlaceholder: (
    source: NodeSelector,
    target: NodeId,
    pos: { x: number; y: number },
    nodeIdToDOM?: (id: NodeId) => HTMLElement
  ) => Indicator;
}

export type EditorStoreConfig = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onNodesChange: (query: EditorQuery) => void;
  indicator: Partial<{
    success: string;
    error: string;
    transition: string;
    thickness: number;
  }>;
  handlers: (store: EditorStore) => CoreEventHandlers;
  normalizeNodes: (state: EditorState, previousState: EditorState) => void;
  resolver: Resolver;
};

type Actions = ReturnType<typeof ActionMethods>;
export interface EditorStore extends Store<EditorState> {
  history: History;
  config: EditorStoreConfig;
  handlers: CoreEventHandlers;
  related: RelatedComponents;
  resolver: Resolver;

  actions: Actions & {
    history: {
      undo: () => void;
      redo: () => void;
      ignore: () => Actions;
      throttle: (rate: number) => Actions;
      merge: () => Actions;
    };
  };
  query: EditorQuery;
}
