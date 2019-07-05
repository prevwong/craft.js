import React from "react";
import { ManagerContextProvider } from "./manager";
export * from "./events"
export * from "./manager"
export * from "./nodes"
export * from "./render"
export * from "./interfaces"

export const Craft = ({ children }: any) => {
  return (
    <ManagerContextProvider>
      {children}
    </ManagerContextProvider>
  )
}