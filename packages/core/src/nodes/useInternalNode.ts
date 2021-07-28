import { useMemo, useContext } from 'react';

import { NodeContext, NodeContextType } from './NodeContext';

import { useInternalEditor } from '../editor/useInternalEditor';
import { Node } from '../interfaces';

type internalActions = NodeContextType & {
  inNodeContext: boolean;
  actions: {
    setProp: (cb: (props: any) => void, throttleRate?: number) => void;
    setCustom: (cb: (custom: any) => void, throttleRate?: number) => void;
    setHidden: (bool: boolean) => void;
  };
};

// TODO: Deprecate useInternalNode in favor of useNode
export type useInternalNodeReturnType<S = null> = S extends null
  ? internalActions
  : S & internalActions;
export function useInternalNode(): useInternalNodeReturnType;
export function useInternalNode<S = null>(
  collect?: (node: Node) => S
): useInternalNodeReturnType<S>;
export function useInternalNode<S = null>(
  collect?: (node: Node) => S
): useInternalNodeReturnType<S> {
  const context = useContext(NodeContext);
  const { id, related, connectors } = context;

  const { actions: EditorActions, query, ...collected } = useInternalEditor(
    (state) => id && state.nodes[id] && collect && collect(state.nodes[id])
  );

  const actions = useMemo(() => {
    return {
      setProp: (cb: any, throttleRate?: number) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setProp(id, cb);
        } else {
          EditorActions.setProp(id, cb);
        }
      },
      setCustom: (cb: any, throttleRate?: number) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setCustom(id, cb);
        } else {
          EditorActions.setCustom(id, cb);
        }
      },
      setHidden: (bool: boolean) => EditorActions.setHidden(id, bool),
    };
  }, [EditorActions, id]);

  return {
    ...(collected as any),
    id,
    related,
    inNodeContext: !!context,
    actions,
    connectors,
  };
}
