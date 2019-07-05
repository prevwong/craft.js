import React from "react";
import {useManager} from "./useManager";
import { ManagerState, ConnectedManager } from "../interfaces";

export function connectManager<S = null>(mapManagerState?: (state: ManagerState) => S) {
  return function <P extends {manager: ConnectedManager<S>}, C>(WrappedComponent: React.JSXElementConstructor<P> | React.ComponentClass<P>) {
    type Props = JSX.LibraryManagedAttributes<C, Omit<P, keyof {manager: ConnectedManager<S>}>>;
    return function (props: Props) {
      const manager = useManager(mapManagerState);
      return <WrappedComponent manager={manager} {...props as any} />
    }
  }
}