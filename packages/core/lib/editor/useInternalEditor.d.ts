/// <reference types="react" />
import {
  useCollectorReturnType,
  QueryCallbacksFor,
  EventHandlerConnectors,
} from '@craftjs/utils';
import { QueryMethods } from './query';
import { EditorStore } from './store';
import { CoreEventHandlers } from '../events/CoreEventHandlers';
import { EditorState } from '../interfaces';
export declare type EditorCollector<C> = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => C;
export declare type useInternalEditorReturnType<
  C = null
> = useCollectorReturnType<EditorStore, C> & {
  inContext: boolean;
  store: EditorStore;
  connectors: EventHandlerConnectors<CoreEventHandlers, React.ReactElement>;
};
export declare function useInternalEditor<C>(
  collector?: EditorCollector<C>
): useInternalEditorReturnType<C>;
