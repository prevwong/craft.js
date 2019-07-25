import { useContext, useMemo } from "react";
import { NodeContext } from "./NodeContext";
import { Node, NodeRef, NodeRefEvent } from "../interfaces";
import { useManager } from "../connectors";

type internalActions = {
  actions : {
    setProp: Function,
    setRef: Function,
    setNodeEvent: Function
  }
}

type useInternalNode<S = null> = S extends null ? internalActions : S & internalActions;
export function useInternalNode() : useInternalNode
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S>
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S> {
  const nodeContext = useContext(NodeContext);
  if (!nodeContext) {
    return null
  }
  const { id } = nodeContext;

  const { actions: managerActions, query, ...collected } = collect ? useManager((state) => collect(state.nodes[id])) : useManager();

  const actions = useMemo(() => {
    return {
      setProp: (cb: any) => managerActions.setProp(id, cb),
      setRef: (ref: keyof NodeRef, value: any) => {
        return managerActions.setRef(id, ref, value);
      },
      setNodeEvent: (action: keyof NodeRefEvent) => managerActions.setNodeEvent(action, id)
    }
  }, []);

  return {
    ...collected as any,
     actions 
  }
}

