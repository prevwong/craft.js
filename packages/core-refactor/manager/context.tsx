import React from "react";
import useMethods, { StateAndCallbacksFor } from "use-methods";
import methods from "./methods";

export const ManagerContext = React.createContext<StateAndCallbacksFor<typeof methods> | null>(null);

export const ManagerContextProvider = ({ children, nodes: defaultNodes }: any) => {
  const [state, actions] = useMethods(methods, { nodes: defaultNodes ? defaultNodes : {}, events: {active: null, dragging: null, hover: null} });
  (window as any).nodes = state.nodes;
  return (
    <ManagerContext.Provider value={[state, actions]}>
      {children}
    </ManagerContext.Provider>
  )
}


