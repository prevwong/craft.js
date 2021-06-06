import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';

import { EditorStore } from '../editor/EditorStore';
import { QueryMethods } from '../editor/query';
import { useInternalEditor } from '../editor/useInternalEditor';
import { CoreEventHandlers } from '../events';

export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onNodesChange: (query: ReturnType<typeof QueryMethods>) => void;
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
  normalizeNodes: (state: EditorState, previousState: EditorState) => void;
};

export type Resolver = Record<string, string | React.ElementType>;

export interface Indicator {
  placement: Placement;
  error: string | false;
}

export type EditorEvents = Record<NodeEventTypes, Set<NodeId>>;

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  options: Options;
  handlers: CoreEventHandlers;
  indicator: Indicator;
};

export type ConnectedEditor = ReturnType<typeof useInternalEditor>;
