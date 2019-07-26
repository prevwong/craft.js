import { useContext, useMemo } from "react";
import { NodeContext } from "./NodeContext";
import { Node, NodeRef, NodeRefEvent } from "../interfaces";
import { useManager } from "../connectors";

type internalActions = {
  _inNodeContext: boolean,
  actions : {
    setProp: Function,
    setRef: (cb: (ref: NodeRef) => void) => void,
    setNodeEvent: Function
  }
}

type useInternalNode<S = null> = S extends null ? internalActions : S & internalActions;
export function useInternalNode() : useInternalNode
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S>
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S> {
  const nodeContext = useContext(NodeContext);
  if (!nodeContext) {
    return {
      ...{} as any,
      _inNodeContext: false,
      actions: {}
    }
  }
  const { id } = nodeContext;

  const { actions: managerActions, query, ...collected } = collect ? useManager((state) => collect(state.nodes[id])) : useManager();

  const actions = useMemo(() => {
    return {
      setProp: (cb: any) => managerActions.setProp(id, cb),
      setRef: (cb: (ref: NodeRef) => void) => {
        return managerActions.setRef(id, cb);
      },
      setNodeEvent: (action: keyof NodeRefEvent) => managerActions.setNodeEvent(action, id)
    }
  }, []);

  return {
    ...collected as any,
    _inNodeContext: true,
     actions 
  }
}

