import React from "react";
import { ManagerContextProvider } from "./manager";
import { EventsManager } from "./events";

export const Craft = ({children}: any) => {
  return (
    <ManagerContextProvider>
      <EventsManager>
        {children}
      </EventsManager>
    </ManagerContextProvider>
  )
}