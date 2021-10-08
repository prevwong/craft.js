import { ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT } from '@craftjs/utils';
import { useMemo, useContext } from 'react';
import invariant from 'tiny-invariant';

import { NodeContext, NodeContextType } from './NodeContext';

import { useInternalEditor } from '../editor/useInternalEditor';
import { Node } from '../interfaces';

type internalActions<P = any> = NodeContextType & {
  inNodeContext: boolean;
  actions: {
    setProp: (cb: (props: P) => void, throttleRate?: number) => void;
    setCustom: (cb: (custom: any) => void, throttleRate?: number) => void;
    setHidden: (bool: boolean) => void;
  };
};

// TODO: Deprecate useInternalNode in favor of useNode
export type useInternalNodeReturnType<S = null, P = any> = S extends null
  ? internalActions<P>
  : S & internalActions<P>;
export function useInternalNode(): useInternalNodeReturnType;
export function useInternalNode<S = null, P = any>(
  collect?: (node: Node<P>) => S
): useInternalNodeReturnType<S, P>;
export function useInternalNode<S = null, P = any>(
  collect?: (node: Node<P>) => S
): useInternalNodeReturnType<S, P> {
  const context = useContext(NodeContext);
  invariant(context, ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT);

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
