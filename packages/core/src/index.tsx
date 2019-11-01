export * from "./nodes"
export * from "./render"
export * from "./interfaces";
export * from './connectors';
import React from 'react';
import { Options } from "interfaces";
import { DNDManager } from "./dnd/DNDManager";
import {ManagerContextProvider, createManagerContext} from "./manager";

export const Craft: React.FC<Partial<Options>> = ({ children, ...options }: any) => {
  return (
    <ManagerContextProvider context={createManagerContext({ options })}>
      <DNDManager>
        {children}
      </DNDManager>
    </ManagerContextProvider>
  )
}