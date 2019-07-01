import React, { useContext } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { StateAndCallbacksFor } from "use-methods";
import ManagerMethods, { PublicManagerMethods } from "./methods";

export interface ConnectedManager {
  manager: StateAndCallbacksFor<typeof ManagerMethods>
}

export function connectManager<P extends ConnectedManager, C>(
  WrappedComponent: React.JSXElementConstructor<P>
) {
  type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedManager>>;
  return (props: Props) => {
    const manager = useContext(ManagerContext);

    return <WrappedComponent manager={manager} {...props as any} />;
  }
}
