import { useCollector } from '@craftjs/utils';
import { useMemo, useContext } from 'react';

import { NodeContext } from './NodeContext';

import { useInternalEditor } from '../editor/useInternalEditor';
import { EditorState } from '../interfaces';
import { NodeQuery } from '../store';

export type NodeCollector<C> = (node: NodeQuery) => C;

export function useInternalNode<C = null>(collect?: NodeCollector<C>) {
  const context = useContext(NodeContext);
  const { id, related, connectors } = context;

  const { actions: EditorActions, store } = useInternalEditor();

  const collectorCallback = !collect
    ? null
    : (state: EditorState) =>
        state.nodes[id] && collect(new NodeQuery(store, id));

  const collected = useCollector(store, collectorCallback);

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
    ...collected,
    id,
    related,
    inNodeContext: !!context,
    actions,
    connectors,
  };
}
