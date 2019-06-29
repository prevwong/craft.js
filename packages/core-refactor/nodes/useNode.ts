import { cloneElement, useContext, useCallback, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { NodeContext } from "./NodeContext";
import { ManagerContext } from "../manager";
import { ManagerMethods, PublicManagerMethods } from "../manager/methods";
import { Node } from ".";

export type CraftNodeAPI<M extends ManagerMethods | PublicManagerMethods> = {
  node: Node;
  manager: M
  connectTarget: Function
} 

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
      // console.log("run")
      return (
        state.nodes[id]
      )
    }, [state.nodes[id]]);
      
    const connectTarget = useCallback((render) => {
      return cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();~
          manager.setNodeEvent("active", node)
        },
        ref: (ref: any) => {
          if ( ref ) {
            manager.setDOM(id, ref);
          }
          if ( render.ref ) render.ref(ref);
        }
      });
    }, []);

    return useMemo(() => ({
      node,
      manager,
      connectTarget
    }), [state.nodes[id]])
  }
}

export default useNode;