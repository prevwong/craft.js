import { useContext, useMemo } from "react";
import { NodeContext, NodeProvider } from "./NodeContext";
import { Node, NodeRef, NodeRefEvent } from "../interfaces";
import { useManager } from "../connectors";

type setProp<P> = (props: P) => void;

type internalActions = NodeProvider & {
  _inNodeContext: boolean,
  actions : {
    setProp: (cb: any) => void,
    setRef: (cb: (ref: NodeRef) => void) => void,
    setNodeEvent: Function
  }
}

type useInternalNode<S = null> = S extends null ? internalActions : S & internalActions;
export function useInternalNode() : useInternalNode
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S>
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S> {
  const context = useContext(NodeContext);
  if (!context) {
    return {
      ...{} as any,
      id: null,
      related: false,
      _inNodeContext: false,
      actions: {}
    }
  }
  
  const { id, related } = context;

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
    id,
    related,
    ...collected as any,
    _inNodeContext: true,
     actions 
  }
}

