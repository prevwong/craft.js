import React from "react";
import { RootContextProvider } from "./RootContext";
import { Options } from "./interfaces/root";
export * from "./dnd"
export * from "./manager"
export * from "./nodes"
export * from "./render"
export * from "./interfaces";

export const Craft: React.FC<Partial<Options>> = ({ children, ...props }: any) => {
  return (
    <RootContextProvider {...props}>
        {children}
    </RootContextProvider>
  )
}