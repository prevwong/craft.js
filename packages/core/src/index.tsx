export * from "./nodes"
export * from "./render"
export * from "./interfaces";
export * from './connectors';
import React from 'react';
import { Options } from "interfaces";
import { EventManager } from "./events";
import {ManagerContextProvider} from "./manager";

export const Craft: React.FC<Partial<Options>> = ({ children, ...options }: any) => {
  return (
    <ManagerContextProvider options={options}>
      <EventManager>
        {children}
      </EventManager>
    </ManagerContextProvider>
  )
}