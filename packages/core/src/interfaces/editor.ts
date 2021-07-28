import { QueryCallbacksFor } from '@craftjs/utils';

import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';

import { QueryMethods } from '../editor/query';
import { EditorStore } from '../editor/store';
import { useInternalEditorReturnType } from '../editor/useInternalEditor';
import { CoreEventHandlers } from '../events';

export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onNodesChange: (query: QueryCallbacksFor<typeof QueryMethods>) => void;
  resolver: Resolver;
  enabled: boolean;
  indicator: Partial<{
    success: string;
    error: string;
    transition: string;
    /**
     * height & width of the rendered indicator
     */
    thickness: number;
  }>;
  handlers: (store: EditorStore) => CoreEventHandlers;
};

export type Resolver = Record<string, string | React.ElementType>;

export interface Indicator {
  placement: Placement;
  error: string | false;
}

export type EditorEvents = Record<NodeEventTypes, NodeId | null> & {
  indicator: Indicator | null;
};

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  options: Options;
  handlers: CoreEventHandlers;
};

export type ConnectedEditor<S = null> = useInternalEditorReturnType<S>;
