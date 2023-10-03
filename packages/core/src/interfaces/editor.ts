import { Indicator } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';

import { useInternalEditor } from '../editor/useInternalEditor';

export type EditorEvents = Record<NodeEventTypes, Set<NodeId>>;

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  enabled: boolean;
  indicator: Indicator;
  timestamp: number;
};

export type ConnectedEditor = ReturnType<typeof useInternalEditor>;

export type StateVersion = 'latest' | 'v1';

export type StateVersionOpt = {
  version: StateVersion;
};
