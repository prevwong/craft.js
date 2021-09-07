import {
  useCollector,
  useCollectorReturnType,
  QueryCallbacksFor,
  wrapConnectorHooks,
  EventHandlerConnectors,
} from '@craftjs/utils';
import { useContext, useEffect, useMemo } from 'react';

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
  connectors: EventHandlerConnectors<CoreEventHandlers, React.ReactElement>;
};

export function useInternalEditor<C>(
  collector?: EditorCollector<C>
): useInternalEditorReturnType<C> {
  const handler = useEventHandler();
  const store = useContext(EditorContext);
  const collected = useCollector(store, collector);

  const connectorInstance = useMemo(() => handler.createConnectorInstance(), [
    handler,
  ]);

  useEffect(() => {
    return () => {
      if (!connectorInstance) {
        return;
      }

      connectorInstance.cleanup();
    };
  }, [connectorInstance]);

  const connectors = useMemo(
    () => connectorInstance && wrapConnectorHooks(connectorInstance.connectors),
    [connectorInstance]
  );

  return {
    ...collected,
    connectors,
    inContext: !!store,
    store,
  };
}
