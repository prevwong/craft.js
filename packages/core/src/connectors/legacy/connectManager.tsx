import { ManagerState } from "../../interfaces";
import React from "react";
import { useManager } from "../useManager";

export function connectManager<C>(collect?: (state: ManagerState) => C) {
  return (WrappedComponent: React.ElementType) => { 
    return (props: any) => {
      const manager = useManager(collect);
      return <WrappedComponent {...manager} {...props} />;
    }
  } 
}
