import React from "react";
import useNode, { CraftNodeAPI } from "./useNode";
import { PublicManagerMethods, ManagerMethods } from "../manager/methods";
import { Node } from ".";

export interface ConnectedNode<M extends ManagerMethods | PublicManagerMethods> {
  craft: CraftNodeAPI<M>
}

export type ConnectedInternalNode = ConnectedNode<ManagerMethods>;
export type ConnectedPublicNode = ConnectedNode<PublicManagerMethods>;

export function connectInternalNode<P extends ConnectedInternalNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedInternalNode>>;
  return (props: Props) => {
    const { node, manager, connectTarget } = useNode();

    return <WrappedComponent craft={{node, manager, connectTarget}} {...props as any} />;
  }
}
export function connectNode<P extends ConnectedPublicNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedPublicNode>>;
  return (props: Props) => {
    const { node, manager: {setNodeEvent, pushChildCanvas, ...manager}, connectTarget } = useNode();
    
    return <WrappedComponent craft={{node, manager, connectTarget}} {...props as any} />;
  }
}


