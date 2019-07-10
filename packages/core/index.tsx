import React, { createContext } from "react";
import { ManagerContextProvider } from "./manager";
import { MonitorProvider } from "./monitor/context";
export * from "./events"
export * from "./manager"
export * from "./nodes"
export * from "./render"
export * from "./interfaces"


const CraftContext = createContext(null);


export const Craft = ({ children }: any) => {
  return (
    <MonitorProvider>
      <ManagerContextProvider>
        {children}
      </ManagerContextProvider>
    </MonitorProvider>
  )
}