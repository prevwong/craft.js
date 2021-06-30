import { History, Store } from '@craftjs/utils';

import { CoreEventHandlers } from '../events';
import { EditorState } from '../interfaces';
import { QueryMethods } from '../store';
import { ActionMethods } from '../store/actions';

export type EditorStoreConfig = {
  onRender: React.ComponentType<{ render: React.ReactElement }>;
  onNodesChange: (query: ReturnType<typeof QueryMethods>) => void;
  indicator: Partial<{
    success: string;
    error: string;
    transition: string;
    thickness: number;
  }>;
  handlers: (store: EditorStore) => CoreEventHandlers;
  normalizeNodes: (state: EditorState, previousState: EditorState) => void;
};

type Actions = ReturnType<typeof ActionMethods>;
export interface EditorStore extends Store<EditorState> {
  history: History;
  config: EditorStoreConfig;
  handlers: CoreEventHandlers;

  actions: Actions & {
    history: {
      undo: () => void;
      redo: () => void;
      ignore: () => Actions;
      throttle: (rate: number) => Actions;
      merge: () => Actions;
    };
  };
  query: ReturnType<typeof QueryMethods> & {
    history: {
      canUndo: () => boolean;
      canRedo: () => boolean;
    };
  };
}
