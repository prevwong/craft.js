import {
  useCollector,
  useCollectorReturnType,
  QueryCallbacksFor,
  wrapConnectorHooks,
  ChainableConnectors,
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
} from '@craftjs/utils';
import { useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';

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
  const store = useContext(EditorContext);
  invariant(
    Object.keys(store).length > 0,
    ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT
  );

  const handlers = useEventHandler();
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
