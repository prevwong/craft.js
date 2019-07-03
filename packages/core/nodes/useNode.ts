import { cloneElement, useContext, useCallback, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { NodeContext } from "./NodeContext";
import { ManagerContext } from "../manager";
import { isCanvas } from "../utils";
import { ConnectedNode } from "../interfaces";
import useManager from "../manager/useManager";

const useNode = () : ConnectedNode => {
  const nodeContext = useContext(NodeContext);
  if ( !nodeContext ) {
    return {
      node: null,
      connectTarget: useCallback((render) => render, []),
      setProp: () => {}
    }
  } else {
    const {id} = nodeContext;
    const { node, setRef, setNodeEvent, setProp: setManagerProp} = useManager((state) => ({node: state.nodes[id]}));
    const connectTarget = useCallback((render, nodeMethods) => {
      return cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();
          if ( node.id !== "rootNode" ) setNodeEvent("active", node.id)
        },
        ref: (ref: any) => {
          if ( ref ) {
            setRef(id, "dom", ref);
            if ( nodeMethods ) { 
              if ( nodeMethods.canDrag ) setRef(id, "canDrag", nodeMethods.canDrag);
              if ( isCanvas(node) ) {
                if ( nodeMethods.incoming ) setRef(id, "incoming", nodeMethods.incoming) 
                if ( nodeMethods.outgoing ) setRef(id, "outgoing", nodeMethods.outgoing);
              }
            }
          }
          if ( render.ref ) render.ref(ref);
        }
      });
    }, []);

    const setProp = useCallback((prop, value) => {
      setManagerProp(node.id, prop, value);
    }, []);

    return useMemo(() => ({
      node,
      connectTarget,
      setProp
    }), [node.data])
  }
}

export default useNode;