import React, { useMemo, useContext, useCallback } from "react";
import { ManagerContext } from "../manager";
import { NodeId, Node } from ".";
import { PublicManagerMethods, ManagerMethods } from "../manager/methods";

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
}

export const NodeProvider: React.FC<NodeProvider> = ({ id, children }) => {
  return (
    <NodeContext.Provider value={{ id }}>
      {children}
    </NodeContext.Provider>
  )
}

export interface ConnectedNode<M extends ManagerMethods | PublicManagerMethods> {
  node: Node;
  manager: M  // manager's methods
}

export interface ConnectedPublicNode extends ConnectedNode<PublicManagerMethods> {
  connectTarget: Function
}

export const useNode = () => {
  const { id } = useContext(NodeContext);
  const [state, manager] = useContext(ManagerContext);

  const node = useMemo(() => (
    state.nodes[id]
  ), [state.nodes[id]]);

  return {
    node,
    manager
  }
}

export function connectInternalNode<P extends ConnectedNode<ManagerMethods>, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedNode<ManagerMethods>>>;
  return (props: Props) => {
    const { id } = useContext(NodeContext);
    const [state, methods] = useContext(ManagerContext);
    const node = useMemo(() => (
      state.nodes[id]
    ), [state.nodes[id]]);

    return <WrappedComponent node={node} manager={methods} {...props as any} />;
  }
}


export function connectNode<P extends ConnectedPublicNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedPublicNode>>;
  return (props: Props) => {
    const { node, manager } = useNode();

    const connectTarget = useCallback((render) => {
      return React.cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();~
          manager.setNodeEvent("active", node)
        }
      });
    }, []);

    return <WrappedComponent node={node}  connectTarget={connectTarget} {...props as any} />;
  }
}




export const connectComponent = (Component: React.ElementType) => {
  return (props: any) => {
    const { id } = useContext(NodeContext);
    const [state, methods] = useContext(ManagerContext);
    const node = useMemo(() => (
      state.nodes[id]
    ), [state.nodes[id]]);

    const connectTarget = useCallback((render) => {
      return React.cloneElement(render, {
        onMouseDown: (e) => {
          e.stopPropagation();~
          methods.setNodeEvent("active", id)
        }
      });
    }, []);

    return <Component node={node} manager={methods} connectTarget={connectTarget} {...props} />
  }
}
