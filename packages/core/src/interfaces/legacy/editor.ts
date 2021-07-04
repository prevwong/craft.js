import {
  FreshNode,
  LegacyNodeQuery,
  SerializedNode,
  SerializedNodes,
} from './nodes';

import { EditorStoreConfig } from '../../store';
import { EditorEvents, Indicator } from '../editor';
import { NodeId } from '../nodes';

export interface LegacyStateOptions extends EditorStoreConfig {
  enabled: boolean;
}

export interface LegacyEditorQuery {
  /** Deprecating state accessors **/
  nodes: Record<NodeId, LegacyNodeQuery>;
  events: EditorEvents;
  options: LegacyStateOptions;
  indicator: Indicator;

  /** Deprecating methods from NodeHelpers */
  node: (id: NodeId) => LegacyNodeQuery;
  getOptions(): LegacyStateOptions;
  getSerializedNodes(): SerializedNodes;
  serialize(): string;
  parseSerializedNode(serializedNode: SerializedNode);
  parseFreshNode(freshNode: FreshNode);
}
