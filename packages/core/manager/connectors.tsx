import React, { useContext, useMemo } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { StateAndCallbacksFor } from "use-methods";
import ManagerMethods from "./methods";
import useManager from "./useManager";

export interface ConnectedManager {
  manager: StateAndCallbacksFor<typeof ManagerMethods>
}

export const connectManager = (mapManagerState?: any) => {
  return function <P extends ConnectedManager, C>(WrappedComponent: React.JSXElementConstructor<P>) {
    type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof ConnectedManager>>;
    return function (props: Props) {
      const manager = useManager(mapManagerState);
      return <WrappedComponent manager={manager} {...props as any} />
    }
  }
}
