import React, { useContext, useMemo } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { ManagerMethods } from "./methods";


export default function useManager<S>(mapManagerState?: (state: ManagerState) => S): S & ManagerMethods {
  const [managerState, methods] = useContext(ManagerContext);
  const state = mapManagerState ? useMemo(() => {
    return mapManagerState(managerState);
  }, [managerState]) : null;

  return useMemo(() => {
    return {...state, ...methods}
  }, [state]);
}
