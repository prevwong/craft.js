import { useContext} from "react";
import { EditorState } from "../interfaces";
import { QueryMethods } from "./query";
import { useCollector, QueryCallbacksFor } from "@craftjs/utils";
import Actions from "./actions";
import { EventContext } from "../events";
import { EditorContext } from "./EditorContext";

export type EditorCollector<C> = (state: EditorState, query: QueryCallbacksFor<typeof QueryMethods>) => C

export type useInternalEditor<C = null> = (C extends null ? useCollector<typeof Actions, typeof QueryMethods> : useCollector<typeof Actions, typeof QueryMethods, C>) & {
  inContext: boolean;
  handlers: EventContext
};

export function useInternalEditor(): useInternalEditor
export function useInternalEditor<C>(collector: EditorCollector<C>): useInternalEditor<C>
export function useInternalEditor<C>(collector?: any): useInternalEditor<C> {
  const handlers = useContext(EventContext);
  const Editor = useContext<EditorContext>(EditorContext);
  const collected = Editor ? useCollector(Editor, collector, (collected, finalize) => finalize(collected)) : {actions: {}};

  return {
    ...collected as any,
    handlers: handlers || {},
    inContext: !!Editor
  }
}
