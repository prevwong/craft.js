import React from "react";
import { Options } from "../interfaces";
import { EditorContextProvider } from "./EditorContext";
import { EventManager } from "../events";


export const Editor: React.FC<Options> = ({ children, ...options }: any) => {
  return (
    <EditorContextProvider options={options}>
      <EventManager>
        {children}
      </EventManager>
    </EditorContextProvider>
  )
}