import { useInternalEditor, EditorCollector } from "../editor/useInternalEditor";
import { ConnectorElementWrapper} from "@craftjs/utils";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type Delete<T, U> = Pick<T, Exclude<keyof T, U>>;

export type useEditor<S = null> = 
  Overwrite<useInternalEditor<S>, {
    actions: Delete<useInternalEditor<S>['actions'], 'setNodeEvent' | 'setDOM'>
  }> & {
  connectors: { 
    select: ConnectorElementWrapper,
    drag: ConnectorElementWrapper,
    hover: ConnectorElementWrapper,
    create: ConnectorElementWrapper
  }
}

export function useEditor(): useEditor;
export function useEditor<S>(collect: EditorCollector<S>): useEditor<S>;

export function useEditor<S>(collect?: any): useEditor<S> {
  const {handlers, actions: {setDOM, setNodeEvent, ...actions}, ...collected} = collect ? useInternalEditor(collect) : useInternalEditor();
  
  return {
    connectors: handlers,
    actions,
    ...collected as any
  }
}
