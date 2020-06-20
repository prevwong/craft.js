import { useContext, useMemo } from 'react';
import { EditorState } from '../interfaces';
import { QueryMethods } from './query';
import { useCollector, QueryCallbacksFor } from '@craftjs/utils';
import { Actions } from './actions';
import { useEventHandler } from '../events/EventContext';
import { EditorContext } from './EditorContext';
import { EventConnectors } from '../events/EventHandlers';

export type EditorCollector<C> = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => C;

export type useInternalEditor<C = null> = (C extends null
  ? useCollector<typeof Actions, typeof QueryMethods>
  : useCollector<typeof Actions, typeof QueryMethods, C>) & {
  inContext: boolean;
  store: EditorContext;
  connectors: EventConnectors;
};

export function useInternalEditor(): useInternalEditor;
export function useInternalEditor<C>(
  collector: EditorCollector<C>
): useInternalEditor<C>;
export function useInternalEditor<C>(collector?: any): useInternalEditor<C> {
  const handlers = useEventHandler();
  const store = useContext<EditorContext>(EditorContext);
  const collected = useCollector(store, collector);

  const connectors = useMemo(() => handlers && handlers.connectors(), [
    handlers,
  ]);

  return {
    ...(collected as any),
    connectors: connectors || {},
    inContext: !!store,
    store,
  };
}
