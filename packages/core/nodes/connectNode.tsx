import React, { useMemo } from "react";
import {useNode} from ".";
import { ConnectedNode } from "../interfaces";


export function connectNode<P extends ConnectedNode, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {  
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedNode>>;
  let ConnectedComponent = (props: Props) => {
    const target = useNode();
    return useMemo(() => <WrappedComponent {...target} {...props as any} />, [target.node]);
  }

  (ConnectedComponent as any).displayName = WrappedComponent.name;

  return ConnectedComponent;
}


