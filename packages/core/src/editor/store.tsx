import { useMethods, SubscriberAndCallbacksFor } from '@craftjs/utils';
import { Actions } from './actions';
import { QueryMethods } from './query';

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>;

export const editorInitialState = {
  nodes: {},
  events: {
    dragged: null,
    selected: null,
    hovered: null,
    indicator: null,
  },
};

export const useEditorStore = (options): EditorStore => {
  return useMethods(
    Actions,
    {
      ...editorInitialState,
      options,
    },
    QueryMethods
  );
};
