import React, { useContext, useMemo } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { ManagerMethods } from "./methods";
import { QueryMethods } from "./query";

export function useManager(): ManagerMethods;
export function useManager<S>(mapManagerState: (state: ManagerState) => S): ManagerMethods & {query: QueryMethods} & S;
export function useManager(mapManagerState?: Function) {
  const [managerState, dispatchers] = useContext(ManagerContext);
  const state = mapManagerState ? useMemo(() => {
    return mapManagerState(managerState);
  }, [managerState]) : null;
  
  const query = useMemo(() => {
    return state ? QueryMethods(managerState.nodes) : null;    
  }, [state]);


  return useMemo(() => {
    return {...state, ...dispatchers, query}
  }, [state]);
}
 
