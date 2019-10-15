import React, { createContext, useMemo } from "react";
import { Options } from "../interfaces/root";
import { createOptions } from "./createOptions";
import { createManagerStore, ManagerStore } from "../manager/store";
import { Nodes, ManagerEvents } from "../interfaces";
import { ROOT_NODE } from "craftjs-utils";
import { Canvas } from "../nodes";
import { transformJSXToNode } from "../utils/transformJSX";

export type RootContext = ManagerStore
export type RootContextIntializer = {
  nodes?: Nodes,
  events?: ManagerEvents,
  options?: Partial<Options>

}

export const createRootContext = (data: RootContextIntializer = {
  nodes: {
    [ROOT_NODE]: transformJSXToNode(<Canvas />)
  },
  events: {
    active: null,
    hover: null,
    dragging: null,
    placeholder: null
  },
  options: {}
}) => {
  const { nodes, events, options } = data;

  return createManagerStore(nodes, events, createOptions(options))
}

export const RootContext = createContext<RootContext>(null);
export const RootContextProvider: React.FC<{context?: RootContext}> = ({ children, context }) => {

  const newContext = useMemo(() => context ? context : createRootContext(), []);

  return (
    <RootContext.Provider value={newContext}>
      {children}
    </RootContext.Provider>
  )
}