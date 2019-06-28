import React, { useContext } from "react";
import { ManagerContext } from "./context";

export const connectRoot = (Component: React.ElementType) => {
  return (props : any) => {
    const manager = useContext(ManagerContext);
    return <Component {...props} manager={manager} />
  }
}