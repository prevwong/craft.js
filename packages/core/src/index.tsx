export * from "./nodes"
export * from "./render"
export * from "./interfaces";
export * from './connectors';
import React from 'react';
import { Options } from "interfaces";
import { EventManager } from "./dnd/EventManager";
import {ManagerContextProvider, createManagerContext} from "./manager";

export const Craft: React.FC<Partial<Options>> = ({ children, ...options }: any) => {
  return (
    <ManagerContextProvider context={createManagerContext({ options })}>
      <EventManager>
        {children}
      </EventManager>
    </ManagerContextProvider>
  )
}