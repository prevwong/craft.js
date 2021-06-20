import { useCollector, wrapConnectorHooks } from '@craftjs/utils';
import { useContext, useMemo } from 'react';

import { EditorContext } from './EditorContext';
import { EditorStore } from './EditorStore';

import { EditorState } from '../interfaces';

export type EditorCollector<C> = (
  state: EditorState,
  query: EditorStore['query']
) => C;

export function useInternalEditor<C>(collector?: EditorCollector<C>) {
  const { store } = useContext(EditorContext);
  const handlers = store.handlers;

  const collectorCallback = !collector
    ? null
    : (state) => collector(state, store.query);

  const collected = useCollector(store, collectorCallback);

  const connectors = useMemo(
    () => handlers && wrapConnectorHooks(handlers.connectors),
    [handlers]
  );

  const actions = useMemo(() => store.actions, [store]);
  const query = useMemo(() => store.query, [store]);

  return {
    ...collected,
    actions,
    query,
    connectors,
    inContext: !!store,
    store,
  };
}
