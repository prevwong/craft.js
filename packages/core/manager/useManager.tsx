import React, { useContext, useMemo } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { ManagerMethods } from "./methods";
import { QueryMethods } from "./query";

type connectedManager = {
  query: QueryMethods
} & ManagerMethods



export function useManager(): connectedManager;
export function useManager<S>(mapManagerState: (state: ManagerState) => S): connectedManager & S;
export function useManager(mapManagerState?: Function) {
  const [managerState, dispatchers] = useContext(ManagerContext);
  const state = mapManagerState ? useMemo(() => {
    return mapManagerState(managerState);
  }, [managerState]) : null;
  
  const query = useMemo(() => {
    return managerState.nodes ? QueryMethods(managerState.nodes) : null;    
  }, [managerState.nodes]);


  return useMemo(() => {
    return {...state, ...dispatchers, query}
  }, [state]);
}
 
