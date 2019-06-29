import { cloneElement, useContext, useCallback, useMemo } from "react";
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

    const node = useMemo(() => (
      state.nodes[id]
    ), [state.nodes[id]]);
      
    const connectTarget = useCallback((render) => {
      return cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();~
          manager.setNodeEvent("active", node)
        }
      });
    }, []);

    return {
      node,
      manager,
      connectTarget
    }
  }
}

export default useNode;