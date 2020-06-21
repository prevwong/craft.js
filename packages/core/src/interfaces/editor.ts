import { QueryCallbacksFor } from '@craftjs/utils';

import { Nodes, NodeEvents, NodeId } from './nodes';
import { Placement } from './events';
import { useInternalEditor } from '../editor/useInternalEditor';
import { QueryMethods } from '../editor/query';

export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onNodesChange: (query: QueryCallbacksFor<typeof QueryMethods>) => void;
  resolver: Resolver;
  enabled: boolean;
  indicator: Record<'success' | 'error', string>;
};

export type Resolver = Record<string, string | React.ElementType>;

export interface Indicator {
  placement: Placement;
  error: string | false;
}

export type EditorEvents = Record<NodeEvents, NodeId | null> & {
  indicator: Indicator | null;
};

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  options: Options;
};

export type ConnectedEditor<S = null> = useInternalEditor<S>;
