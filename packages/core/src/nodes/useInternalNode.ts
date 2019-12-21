import { useContext, useMemo } from "react";
import { NodeContext, NodeProvider } from "./NodeContext";
import { Node, NodeRefEvent } from "../interfaces";
import { useEditor } from "../connectors";
import { useInternalEditor } from "../editor/useInternalEditor";


type internalActions = NodeProvider & {
  inNodeContext: boolean,
  actions : {
    setProp: (cb: any) => void,
    setDOM: (dom: HTMLElement) => void,
    setNodeEvent: Function
  }
}

export type useInternalNode<S = null> = S extends null ? internalActions : S & internalActions;
export function useInternalNode() : useInternalNode
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S>
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S> {
  const context = useContext(NodeContext);
  if (!context) {
    return {
      ...{} as any,
      id: null,
      related: false,
      inNodeContext: false,
      actions: {
        setProp: () => {},
        setDOM: () => {},
        setNodeEvent: () => {}
      }
    }
  }
  
  const { id, related } = context;
  
  const { actions: EditorActions, query, ...collected } = collect ? useInternalEditor((state) => id && state.nodes[id] && collect(state.nodes[id])) : useInternalEditor();
  const actions = useMemo(() => {
    return {
      setProp: (cb: any) => EditorActions.setProp(id, cb),
      setDOM: (dom: HTMLElement) => {
        return EditorActions.setDOM(id, dom);
      }
    }
  }, []);

  return {
    id,
    related,
    ...collected as any,
    inNodeContext: true,
     actions 
  }
}


