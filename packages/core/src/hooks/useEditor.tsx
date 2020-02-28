import {
  useInternalEditor,
  EditorCollector
} from "../editor/useInternalEditor";
import { ConnectorElementWrapper } from "@craftjs/utils";
import { useMemo } from "react";
import { NodeId } from "../interfaces";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type Delete<T, U> = Pick<T, Exclude<keyof T, U>>;

export type useEditor<S = null> = Overwrite<
  useInternalEditor<S>,
  {
    actions: Delete<
      useInternalEditor<S>["actions"],
      "setNodeEvent" | "setDOM" | "replaceNodes" | "reset"
    > & {
      selectNode: (nodeId: NodeId | null) => void;
    };
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
    actions: { setDOM, setNodeEvent, replaceNodes, reset, ...EditorActions },
    query: { deserialize, ...query },
    ...collected
  } = useInternalEditor(collect);

  const actions = useMemo(() => {
    return {
      ...EditorActions,
      selectNode: (nodeId: NodeId | null) => {
        setNodeEvent("selected", nodeId);
        setNodeEvent("hovered", null);
      }
    };
  }, [EditorActions, setNodeEvent]);

  return {
    connectors: handlers,
    actions,
    query,
    ...(collected as any)
  };
}
