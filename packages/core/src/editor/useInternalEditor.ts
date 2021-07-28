import {
  useCollector,
  useCollectorReturnType,
  QueryCallbacksFor,
  wrapConnectorHooks,
  ChainableConnectors,
} from '@craftjs/utils';
import { useContext, useMemo } from 'react';

import { EditorContext } from './EditorContext';
import { QueryMethods } from './query';
import { EditorStore } from './store';

import { CoreEventHandlers } from '../events/CoreEventHandlers';
import { useEventHandler } from '../events/EventContext';
import { EditorState } from '../interfaces';

export type EditorCollector<C> = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => C;

export type useInternalEditorReturnType<C = null> = useCollectorReturnType<
  EditorStore,
  C
> & {
  inContext: boolean;
  store: EditorStore;
  connectors: ChainableConnectors<
    CoreEventHandlers['connectors'],
    React.ReactElement
  >;
};

export function useInternalEditor<C>(
  collector?: EditorCollector<C>
): useInternalEditorReturnType<C> {
  const handlers = useEventHandler();
  const store = useContext(EditorContext);
  const collected = useCollector(store, collector);

  const connectors = useMemo(
    () => handlers && wrapConnectorHooks(handlers.connectors),
    [handlers]
  );

  return {
    ...collected,
    connectors,
    inContext: !!store,
    store,
  };
}
