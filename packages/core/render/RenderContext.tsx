import React from "react";
import { Node } from "../interfaces";

export type RenderContext = {
  onRender: React.FC<{render: React.ReactElement, node: Node}>
}

export const RenderContext = React.createContext<RenderContext>(null);

export const RenderContextProvider: React.FC<RenderContext> = ({ children, onRender }) => {
  return (
    <RenderContext.Provider value={{onRender}}>
      {children}
    </RenderContext.Provider>
  )
}