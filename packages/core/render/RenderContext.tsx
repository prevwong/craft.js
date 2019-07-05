import React from "react";
import { Node } from "../interfaces";
import { Placeholder } from "./RenderPlaceholder";

export type RenderContext = {
  onRender: React.FC<{render: React.ReactElement, node: Node}>
  renderPlaceholder: React.FC<Placeholder>
}

export const RenderContext = React.createContext<RenderContext>(null);

export const RenderContextProvider: React.FC<RenderContext> = ({ children, onRender, renderPlaceholder }) => {
  return (
    <RenderContext.Provider value={{ onRender, renderPlaceholder}}>
      {children}
    </RenderContext.Provider>
  )
}
