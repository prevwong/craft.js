/// <reference types="react" />
import { QueryCallbacksFor, Delete, PatchListenerAction } from '@craftjs/utils';
import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';
import { QueryMethods } from '../editor/query';
import { EditorStore, ActionMethodsWithConfig } from '../editor/store';
import { useInternalEditorReturnType } from '../editor/useInternalEditor';
import { CoreEventHandlers } from '../events';
export declare type Options = {
  onRender: React.ComponentType<{
    render: React.ReactElement;
  }>;
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
export declare type Resolver = Record<string, string | React.ElementType>;
export interface Indicator {
  placement: Placement;
  error: string | null;
}
export declare type EditorEvents = Record<NodeEventTypes, Set<NodeId>>;
export declare type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  options: Options;
  handlers: CoreEventHandlers;
  indicator: Indicator;
};
export declare type ConnectedEditor<S = null> = useInternalEditorReturnType<S>;
