import { QueryCallbacksFor, Delete, PatchListenerAction } from '@craftjs/utils';

import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId, Node } from './nodes';

import { QueryMethods } from '../editor/query';
import { EditorStore, ActionMethodsWithConfig } from '../editor/store';
import { useInternalEditorReturnType } from '../editor/useInternalEditor';
import { CoreEventHandlers } from '../events';

export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onBeforeMoveEnd: (
    targetNode: Node,
    newParentNode: Node,
    existingParentNode: Node
  ) => void;
  onNodesChange: (query: QueryCallbacksFor<typeof QueryMethods>) => void;
  resolver: Resolver;
  enabled: boolean;
  indicator: Partial<{
    success: string;
    error: string;
    transition: string;
    thickness: number;
  }>;
  handlers: (store: EditorStore) => CoreEventHandlers;
  normalizeNodes: (
    state: EditorState,
    previousState: EditorState,
    actionPerformed: Delete<
      PatchListenerAction<EditorState, typeof ActionMethodsWithConfig>,
      'patches'
    >,
    query: QueryCallbacksFor<typeof QueryMethods>
  ) => void;
};

export type Resolver = Record<string, string | React.ElementType>;

export interface Indicator {
  placement: Placement;
  error: string | null;
}

export type EditorEvents = Record<NodeEventTypes, Set<NodeId>>;

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  options: Options;
  handlers: CoreEventHandlers;
  indicator: Indicator;
};

export type ConnectedEditor<S = null> = useInternalEditorReturnType<S>;
