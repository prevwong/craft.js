import React, { useContext, useMemo } from "react";
import { ManagerContext } from "./context";
import { ManagerState } from "../interfaces";
import { ManagerMethods } from "./methods";
import { QueryMethods } from "./query";
import { CallbacksFor, ActionUnion } from "use-methods";

type connectedManager<S> = {
  query: QueryMethods
} & S & ManagerMethods

export default function useManager<S>(mapManagerState?: (state: ManagerState) => S): connectedManager<S>  {
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
