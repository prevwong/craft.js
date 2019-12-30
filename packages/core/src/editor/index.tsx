import React from "react";
import { Options } from "../interfaces";
import { EditorContextProvider } from "./EditorContextProvider";
import { EventManager } from "../events/EventManager";


export const Editor: React.FC<Partial<Options>> = ({ children, ...options }: any) => {
  return (
    <EditorContextProvider options={options}>
      <EventManager>
        {children}
      </EventManager>
    </EditorContextProvider>
  )
}