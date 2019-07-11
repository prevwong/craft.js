import { cloneElement, useContext, useCallback, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { useInternalNode } from "./useInternalNode";
import { MonitorContext } from "../monitor";
import { RootContext } from "../RootContext";
import { Unsubscribe } from "redux";

export function useNode(): any {
  const { node, setProp } = useInternalNode();
  const { monitor } = useContext(RootContext);
  const [subscribe, getState, _, {setNodeEvent, setRef}] = monitor;
  const unsubscribe = useMemo(() => {
    return subscribe(() => {
      const {prev, current} = getState();
      if ( prev.nodes[node.id] !== current.nodes[node.id] ) console.log("changed", node.id)
    })
  }, []);
 
  useEffect(() => {
    return (() => {
      unsubscribe();
    });
  }, []);
  
  const connectTarget = useCallback((render, nodeMethods) => {
    return useMemo(() => cloneElement(render, {
      onMouseDown: (e) => {
        e.stopPropagation();
        setNodeEvent("active", node)
      },
      ref: (ref: any) => {
        if (ref) {
          // setTimeout(() => {
            setRef(node.id, "dom", ref);
          // }, 1000)
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

