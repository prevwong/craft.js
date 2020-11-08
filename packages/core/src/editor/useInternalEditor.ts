import { useCollector, QueryCallbacksFor } from '@craftjs/utils';
import { useContext, useMemo } from 'react';

import { EditorContext } from './EditorContext';
import { QueryMethods } from './query';
import { ActionMethodsWithConfig } from './store';

import { EventConnectors } from '../events/CoreEventHandlers';
import { useEventHandler } from '../events/EventContext';
import { EditorState } from '../interfaces';

export type EditorCollector<C> = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => C;

export type useInternalEditorReturnType<C = null> = (C extends null
  ? useCollector<typeof ActionMethodsWithConfig, typeof QueryMethods>
  : useCollector<typeof ActionMethodsWithConfig, typeof QueryMethods, C>) & {
  inContext: boolean;
  store: EditorContext;
  connectors: EventConnectors;
};

export function useInternalEditor(): useInternalEditorReturnType;
export function useInternalEditor<C>(
  collector: EditorCollector<C>
): useInternalEditorReturnType<C>;
export function useInternalEditor<C>(
  collector?: any
): useInternalEditorReturnType<C> {
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
