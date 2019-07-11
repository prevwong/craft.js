import { useContext, useCallback, useMemo } from "react";
import { NodeContext } from "./NodeContext";
import { Node } from "../interfaces";
import { useCollector } from "../shared/useCollector";

export function useInternalNode(): { node: Node, setProp: (cb: any) => void} {
  const nodeContext = useContext(NodeContext);
  if ( !nodeContext ) {
    return null
  } else {
    const {id} = nodeContext;
    const {node, setProp: setManagerProp} = useCollector('manager', (state) => ({node: state.nodes[id]}));
    
    const setProp = useCallback((cb) => setManagerProp(node.id, cb), []);
    return useMemo(() => ({ node, setProp}), [node.data])
  }
}

