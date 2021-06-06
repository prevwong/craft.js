import { useCollector, wrapConnectorHooks } from '@craftjs/utils';
import { useContext, useMemo } from 'react';

import { EditorContext } from './EditorContext';
import { QueryMethods } from './query';

import { useEventHandler } from '../events/EventContext';
import { EditorState } from '../interfaces';

export type EditorCollector<C> = (
  state: EditorState,
  query: ReturnType<typeof QueryMethods>
) => C;

export function useInternalEditor<C>(collector?: EditorCollector<C>) {
  const handlers = useEventHandler();
  const { store } = useContext(EditorContext);

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
