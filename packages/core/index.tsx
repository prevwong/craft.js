import React from "react";
import { ManagerContextProvider } from "./manager";
import EventsManager from "./events";
export * from "./events"
export * from "./manager"
export * from "./nodes"
export * from "./render"
export const Craft = ({children}: any) => {
  return (
    <ManagerContextProvider>
      <EventsManager>
        {children}
      </EventsManager>
    </ManagerContextProvider>
  )
}