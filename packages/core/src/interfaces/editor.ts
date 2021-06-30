import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';

import { useInternalEditor } from '../editor/useInternalEditor';

// TODO: remove options from state
export type Options = {
  resolver: Resolver;
  enabled: boolean;
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
  indicator: Indicator;
};

export type ConnectedEditor = ReturnType<typeof useInternalEditor>;
