import React, { createContext, useMemo } from "react";
import { MonitorMethods } from "./methods";
import useMethods, { SubscriberAndCallbacksFor } from "../shared/useMethods";

export const MonitorContext = createContext<SubscriberAndCallbacksFor<typeof MonitorMethods>>(null);

export const MonitorProvider: React.FC = ({ children }) => {
  const store = useMethods(MonitorMethods, {
    nodes: {},
    events: {
      active: null,
      dragging: null,
      hover: null
    }
  });

  return (
    <MonitorContext.Provider value={store}>
      {children}
    </MonitorContext.Provider>
  )
}