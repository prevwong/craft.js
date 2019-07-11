import React, { createContext, useMemo } from "react";
import { createMonitorStore, MonitorStore } from "./monitor";
import { createManagerStore, ManagerStore } from "./manager";

export type RootContext  = {
  monitor: MonitorStore,
  manager: ManagerStore
}


export const RootContext = createContext<RootContext>(null);
export const RootContextProvider: React.FC = ({ children }) => {
  const store = useMemo(() => {
    return {
      monitor: createMonitorStore(),
      manager: createManagerStore()
    }
  }, []);

  return (
    <RootContext.Provider value={store}>
      {children}
    </RootContext.Provider>
  )
}