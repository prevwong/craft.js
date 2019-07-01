import React, { useMemo, useContext, useCallback, cloneElement } from "react";
import useNode from "./useNode";
import { PublicManagerMethods, ManagerMethods } from "../manager/methods";
import { ConnectedInternalNode, ConnectedPublicNode } from "../interfaces";
import { RenderContext } from "../render/RenderContext";

export function connectInternalNode<P extends ConnectedInternalNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedInternalNode>>;
  return (props: Props) => {
    const { node, manager, connectTarget } = useNode();
    const { onRender } = useContext(RenderContext);

    return useMemo(() => <WrappedComponent craft={{node, manager, connectTarget}} renderer={{onRender}} {...props as any} />, [node]);
  }
}

/**
 * Nearly identical to conenctInternalNode but hides internal manager methods 
 * @param WrappedComponent 
 */
export function connectNode<P extends ConnectedPublicNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {  
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedPublicNode>>;
  return (props: Props) => {
    const {node, manager: {setNodeEvent, setRef, pushChildCanvas, ...manager}, connectTarget} = useNode();
    return useMemo(() => <WrappedComponent craft={{node, manager, connectTarget}} {...props as any} />, [node]);
  }
}


