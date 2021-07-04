import { History, Store } from '@craftjs/utils';

import { RelatedComponents } from './RelatedComponents';
import { EditorQuery } from './query';

import { CoreEventHandlers } from '../events';
import { EditorState, Resolver } from '../interfaces';
import { ActionMethods } from '../store/actions';

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
  resolver: Resolver;
};

type Actions = ReturnType<typeof ActionMethods>;
export interface EditorStore extends Store<EditorState> {
  history: History;
  config: EditorStoreConfig;
  handlers: CoreEventHandlers;
  related: RelatedComponents;
  resolver: Resolver;

  actions: Actions & {
    history: {
      undo: () => void;
      redo: () => void;
      ignore: () => Actions;
      throttle: (rate: number) => Actions;
      merge: () => Actions;
    };
  };
  query: EditorQuery;
}
