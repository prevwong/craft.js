import React from 'react';
import { Options } from "../interfaces";
import { RootContextProvider, createRootContext } from "./RootContext";
import { DNDManager } from '../dnd/DNDManager';

export const Craft: React.FC<Partial<Options>> = ({ children, ...options }: any) => {
  return (
    <RootContextProvider context={createRootContext({options})}>
      <DNDManager>
        {children}
      </DNDManager>
    </RootContextProvider>
  )
}