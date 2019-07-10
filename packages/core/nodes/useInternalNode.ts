import { cloneElement, useContext, useCallback, useMemo } from "react";
import { NodeContext } from "./NodeContext";
import { ConnectedNode, Node } from "../interfaces";
import {useManager} from "../manager";
import { isCanvas } from "../nodes";

export function useInternalNode(): { node: Node, setProp: (cb: any) => void} {
  const nodeContext = useContext(NodeContext);
  if ( !nodeContext ) {
    return null
  } else {
    const {id} = nodeContext;
    const { node, setProp: setManagerProp, setRef, setNodeEvent} = useManager((state) => ({node: state.nodes[id]}));
    
    const setProp = useCallback((cb) => setManagerProp(node.id, cb), []);
    return useMemo(() => ({ node, setProp, setRef, setNodeEvent }), [node.data])
  }
}

