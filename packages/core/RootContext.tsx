import React, { createContext, useMemo } from "react";
import { createManagerStore, ManagerStore } from "./manager";
import { defaultPlaceholder } from "./render/RenderPlaceholder";
import { Options } from "./interfaces/root";

export type RootContext  = {
  manager: ManagerStore,
  options: Options
}

export const RootContext = createContext<RootContext>(null);
export const RootContextProvider: React.FC<Options> = ({
  children, 
  onRender = ({render}) => render, 
  resolver = {},
  renderPlaceholder = defaultPlaceholder,
  nodes = null
}) => {

  const store = useMemo(() => {
    return {
      manager: createManagerStore(),
      options: { onRender, resolver, nodes, renderPlaceholder}
    }
  }, []);

  return (
    <RootContext.Provider value={store}>
      {children}
    </RootContext.Provider>
  )
}