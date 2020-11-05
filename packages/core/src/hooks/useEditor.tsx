import { Overwrite, Delete, OverwriteFnReturnType } from '@craftjs/utils';
import { useMemo } from 'react';

import {
  useInternalEditor,
  EditorCollector,
  useInternalEditorReturnType,
} from '../editor/useInternalEditor';
import { NodeId } from '../interfaces';

type PrivateActions =
  | 'addLinkedNodeFromTree'
  | 'setNodeEvent'
  | 'setDOM'
  | 'replaceNodes'
  | 'reset';

const getPublicActions = (actions) => {
  const {
    addLinkedNodeFromTree,
    setDOM,
    setNodeEvent,
    replaceNodes,
    reset,
    ...EditorActions
  } = actions;

  return EditorActions;
};

type Actions = useInternalEditorReturnType['actions'];

export type WithoutPrivateActions = Delete<
  Actions,
  PrivateActions | 'history'
> & {
  history: Overwrite<
    Actions['history'],
    {
      ignore: OverwriteFnReturnType<
        Actions['history']['ignore'],
        PrivateActions
      >;
      throttle: OverwriteFnReturnType<
        Actions['history']['throttle'],
        PrivateActions
      >;
    }
  >;
};

export type useEditorReturnType<S = null> = Overwrite<
  useInternalEditorReturnType<S>,
  {
    actions: WithoutPrivateActions & {
      selectNode: (nodeId: NodeId | null) => void;
    };
    query: Delete<useInternalEditorReturnType<S>['query'], 'deserialize'>;
  }
>;

/**
 * A Hook that that provides methods and information related to the entire editor state.
 * @param collector Collector function to consume values from the editor's state
 */
export function useEditor(): useEditorReturnType;
export function useEditor<S>(
  collect: EditorCollector<S>
): useEditorReturnType<S>;

export function useEditor<S>(collect?: any): useEditorReturnType<S> {
  const {
    connectors,
    actions: internalActions,
    query: { deserialize, ...query },
    store,
    ...collected
  } = useInternalEditor(collect);

  const EditorActions = getPublicActions(internalActions);

  const actions = useMemo(() => {
    return {
      ...EditorActions,
      history: {
        ...EditorActions.history,
        ignore: (...args) =>
          getPublicActions(EditorActions.history.ignore(...args)),
        throttle: (...args) =>
          getPublicActions(EditorActions.history.throttle(...args)),
      },
    };
  }, [EditorActions]);

  return {
    connectors,
    actions,
    query,
    store,
    ...(collected as any),
  };
}
