import { CoreEventHandlers } from '../events';
import { EditorState } from '../interfaces';
import { EditorQuery, EditorStore } from '../store';

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
};
