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
    setCustom: (cb: (custom: any) => void) => void;
    setHidden: (bool: boolean) => void;
  };
};

// TODO: Deprecate useInternalNode in favor of useNode
export type useInternalNode<S = null> = S extends null
  ? internalActions
  : S & internalActions;
export function useInternalNode(): useInternalNode;
export function useInternalNode<S = null>(
  collect?: (node: Node) => S
): useInternalNode<S>;
export function useInternalNode<S = null>(
  collect?: (node: Node) => S
): useInternalNode<S> {
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
