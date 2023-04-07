import {
  useCollector,
  wrapConnectorHooks,
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
} from '@craftjs/utils';
import { useContext, useMemo, useEffect } from 'react';
import invariant from 'tiny-invariant';

import { EditorContext } from './EditorContext';

import { EditorQuery } from '../store';

export type EditorCollector<C> = (state: EditorQuery, query: EditorQuery) => C;

export function useInternalEditor<C = null>(collector?: EditorCollector<C>) {
  const { store } = useContext(EditorContext);

  invariant(store, ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);

  const handlers = store.handlers;

  const collected = useCollector(
    store,
    collector
      ? () =>
          collector(
            store.query,
            // For backwards compatibility:
            store.query
          )
      : null
  );

  const connectorsUsage = useMemo(
    () => handlers && handlers.createConnectorsUsage(),
    [handlers]
  );

  useEffect(() => {
    connectorsUsage.register();

    return () => {
      connectorsUsage.cleanup();
    };
  }, [connectorsUsage]);

  const connectors = useMemo(
    () => connectorsUsage && wrapConnectorHooks(connectorsUsage.connectors),
    [connectorsUsage]
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
