import React from "react";
import { RootContextProvider } from "./RootContext";
export * from "./dnd"
export * from "./manager"
export * from "./nodes"
export * from "./render"
export * from "./interfaces";

export const Craft = ({ children }: any) => {
  return (
    <RootContextProvider>{children}</RootContextProvider>
  )
}