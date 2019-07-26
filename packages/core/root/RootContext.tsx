import React, { createContext, useMemo } from "react";
import { defaultPlaceholder } from "../render/RenderPlaceholder";
import { Options } from "../interfaces/root";
import { createOptions } from "./createOptions";
import { createManagerStore, ManagerStore } from "../manager/store";
import { Nodes, ManagerEvents } from "../interfaces";

export type RootContext = {
  manager: ManagerStore,
  options: Options
}

export type RootContextIntializer = {
  nodes?: Nodes,
  events?: ManagerEvents,
  options?: Partial<Options>

}

export const createRootContext = (data: RootContextIntializer = {
  nodes: {},
  events: {
    active: null,
    hover: null,
    selected: null,
    dragging: null,
    placeholder: null
  },
  options: {}
}) => {
  const { nodes, events, options } = data;

  return {
    manager: createManagerStore(nodes, events),
    options: createOptions(options)
  };
}

export const RootContext = createContext<Partial<RootContext>>({});
export const RootContextProvider: React.FC<Partial<{context: RootContext}>> = ({ children, context }) => {

  const newContext = useMemo(() => context ? context : createRootContext(), []);

  return (
    <RootContext.Provider value={newContext}>
      {children}
    </RootContext.Provider>
  )
}