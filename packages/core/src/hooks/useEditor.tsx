import {
  useInternalEditor,
  EditorCollector
} from "../editor/useInternalEditor";
import { ConnectorElementWrapper } from "@craftjs/utils";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type Delete<T, U> = Pick<T, Exclude<keyof T, U>>;

export type useEditor<S = null> = Overwrite<
  useInternalEditor<S>,
  {
    actions: Delete<
      useInternalEditor<S>["actions"],
      "setNodeEvent" | "setDOM" | "replaceNodes" | "reset"
    >;
    query: Delete<useInternalEditor<S>["query"], "deserialize">;
  }
> & {
  connectors: {
    select: ConnectorElementWrapper;
    drag: ConnectorElementWrapper;
    hover: ConnectorElementWrapper;
    create: ConnectorElementWrapper;
  };
};

/**
 * A Hook that that provides methods and information related to the entire editor state.
 * @param collector Collector function to consume values from the editor's state
 */
export function useEditor(): useEditor;
export function useEditor<S>(collect: EditorCollector<S>): useEditor<S>;

export function useEditor<S>(collect?: any): useEditor<S> {
  const {
    handlers,
    actions: { setDOM, setNodeEvent, replaceNodes, reset, ...actions },
    query: { deserialize, ...query },
    ...collected
  } = useInternalEditor(collect);

  return {
    connectors: handlers,
    actions,
    query,
    ...(collected as any)
  };
}
