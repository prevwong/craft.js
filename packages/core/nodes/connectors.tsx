import React, { useMemo } from "react";
import {useNode} from "../nodes";
import { ConnectedNode } from "../interfaces";

/**
 * Nearly identical to conenctInternalNode but hides internal manager methods and renderer
 * @param WrappedComponent 
 */
export function connectNode<P extends ConnectedNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {  
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedNode>>;
  return (props: Props) => {
    const target = useNode();
    return useMemo(() => <WrappedComponent {...target} {...props as any} />, [target.node]);
  }
}


