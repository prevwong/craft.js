import { useContext, useCallback, useMemo } from "react";
import { NodeContext } from "./NodeContext";
import { Node, NodeRef } from "../interfaces";
import { useManager } from "../manager/useManager";

export function useInternalNode<S>(collect?: (node: Node) => S) {
  const nodeContext = useContext(NodeContext); 
  if ( !nodeContext ) {
    return null
  }
  const {id} = nodeContext;

  const {actions, query, ...collected} = useManager((state) => collect(state.nodes[id])) ;

  const setProp = useCallback((cb) => actions.setProp(id, cb), []);
  const setRef = useCallback((ref: keyof NodeRef, value: any) => actions.setRef(id, ref, value), []);
  const setActive = useCallback(() => actions.setNodeEvent("active", id), []);

  return useMemo(() => {
    return { ...collected, actions: { setProp, setRef, setActive}}
  }, [collected])
}

