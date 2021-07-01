import { Placement } from './events';
import { Nodes, NodeEventTypes, NodeId } from './nodes';

import { useInternalEditor } from '../editor/useInternalEditor';

export type Resolver = Record<string, string | React.ElementType>;
export interface Indicator {
  placement: Placement;
  error: string | false;
}

export type EditorEvents = Record<NodeEventTypes, Set<NodeId>>;

export type EditorState = {
  nodes: Nodes;
  events: EditorEvents;
  enabled: boolean;
  indicator: Indicator;
  timestamp: number;
};

export type ConnectedEditor = ReturnType<typeof useInternalEditor>;
