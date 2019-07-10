import { cloneElement, useContext, useCallback, useMemo, useEffect } from "react";
import { NodeContext } from "./NodeContext";
import { ConnectedNode } from "../interfaces";
import { useManager } from "../manager";
import { isCanvas } from "../nodes";
import { useInternalNode } from "./useInternalNode";
import { MonitorContext } from "../monitor/context";

export function useNode(): any {
  const { node, setProp } = useInternalNode();
  const [ subscribe, getState, { setRef, setNodeEvent}] = useContext(MonitorContext);

  useEffect(() => {
    subscribe(() => {
      const { prev, current } = getState();
      if ( prev.nodes[node.id] !== current.nodes[node.id]) console.log("state changed",  node.id, current);
    })
  }, []);
  const connectTarget = useCallback((render, nodeMethods) => {
    return useMemo(() => cloneElement(render, {
      onMouseDown: (e) => {
        e.stopPropagation();
        setNodeEvent("active", node)
      },
      ref: (ref: any) => {
        if (ref) {
          setRef(node.id, "dom", ref);
        }
        // if ( render.ref ) render.ref(ref);
      }
    }), [node.data]);
  }, [node.data]);
  
  return useMemo(() => ({
    node,
    connectTarget
  }), [node.data])

}

