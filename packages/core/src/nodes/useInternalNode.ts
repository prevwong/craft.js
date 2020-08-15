import { useMemo, useContext } from 'react';
import { NodeContext, NodeProvider } from './NodeContext';
import { Node } from '../interfaces';
import { useInternalEditor } from '../editor/useInternalEditor';

import { NodeConnectors } from './NodeHandlers';

type internalActions = NodeProvider & {
  inNodeContext: boolean;
  connectors: NodeConnectors;
  actions: {
    setProp: (cb: (props: any) => void) => void;
    setPropThrottled: (cb: (props: any) => void, throttleRate?: number) => void;
    setCustom: (cb: (custom: any) => void) => void;
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
      setProp: (cb: any) => EditorActions.setProp(id, cb),
      setCustom: (cb: any) => EditorActions.setCustom(id, cb),
      setHidden: (bool: boolean) => EditorActions.setHidden(id, bool),
      setPropThrottled: (cb: any, throttleRate: number) =>
        EditorActions.history.throttle(throttleRate).setProp(id, cb),
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
