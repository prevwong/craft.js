import { cloneElement, useContext, useCallback, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { NodeContext } from "./NodeContext";
import { ManagerContext } from "../manager";
import { ManagerMethods, PublicManagerMethods } from "../manager/methods";
import { CraftNodeAPI } from "../interfaces";
import { isCanvas } from "../utils";

const useNode = () : CraftNodeAPI<ManagerMethods> => {
  const nodeContext = useContext(NodeContext);
  if ( !nodeContext ) {
    return {
      node: null,
      manager: null,
      connectTarget: useCallback((render) => render, [])
    }
  } else {
    const {id} = nodeContext;
    const [state, manager] = useContext(ManagerContext);
    const domRef = useRef(null);

    const node = useMemo(() => {
      return (
        state.nodes[id]
      )
    }, [state.nodes[id]]);

    const connectTarget = useCallback((render, nodeMethods) => {
      return cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();
          if ( node.id !== "rootNode" ) manager.setNodeEvent("active", node.id)
        },
        ref: (ref: any) => {
          if ( ref ) {
            manager.setRef(id, "dom", ref);
            if ( nodeMethods ) { 
              if ( nodeMethods.canDrag ) manager.setRef(id, "canDrag", nodeMethods.canDrag);
              if ( isCanvas(node) ) {
                if ( nodeMethods.incoming ) manager.setRef(id, "incoming", nodeMethods.incoming) 
                if ( nodeMethods.outgoing ) manager.setRef(id, "outgoing", nodeMethods.outgoing);
              }
            }
          }
          if ( render.ref ) render.ref(ref);
        }
      });
    }, []);

    return useMemo(() => ({
      node,
      manager,
      connectTarget
    }), [state.nodes[id].data])
  }
}

export default useNode;