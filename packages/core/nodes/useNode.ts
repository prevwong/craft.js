import { cloneElement, useContext, useCallback, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { NodeContext } from "./NodeContext";
import { ManagerContext } from "../manager";
import { ManagerMethods, PublicManagerMethods } from "../manager/methods";
import { CraftNodeAPI } from "../interfaces";

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

    const connectTarget = useCallback((render) => {
      return cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();
          if ( node.id !== "rootNode" ) manager.setNodeEvent("active", node.id)
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
    }), [state.nodes[id].data])
  }
}

export default useNode;