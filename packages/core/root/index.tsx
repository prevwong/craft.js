import React from 'react';
import { Options } from "../interfaces";
import { RootContextProvider } from "./RootContext";

export const Craft: React.FC<Partial<Options>> = ({ children, ...props }: any) => {
  return (
    <RootContextProvider {...props}>
      {children}
    </RootContextProvider>
  )
}