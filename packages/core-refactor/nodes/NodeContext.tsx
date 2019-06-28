import React, {useMemo, useContext, useCallback} from "react";
import { ManagerContext } from "../manager";
import { NodeId } from ".";

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
}

export const NodeProvider: React.FC<NodeProvider> = ({id, children}) => {
  return (
    <NodeContext.Provider value={{id}}>
      {children}
    </NodeContext.Provider>
  )
}


export const connectInternalNode = (Component: React.ElementType) => {
  return (props: any) =>{
    const { id } = useContext(NodeContext);
    const manager = useContext(ManagerContext);

    const node = useMemo(() =>  (
      manager.state.nodes[id]
    ), [manager.state.nodes[id]]);

    return <Component node={node} manager={manager.methods} {...props} />
  }
}

export const connectComponent = (Component: React.ElementType) => {
  return (props: any) => {
    const { id } = useContext(NodeContext);
    const manager = useContext(ManagerContext);
    const node = useMemo(() =>  (
      manager.state.nodes[id]
    ), [manager.state.nodes[id]]);
    
    const connectTarget = useCallback((render) => {
      return React.cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();
          manager.methods.setNodeEvent("active", id)
        }
      });
    }, []);

    return <Component node={node} manager={manager.methods} connectTarget={connectTarget} {...props} />
  }
}