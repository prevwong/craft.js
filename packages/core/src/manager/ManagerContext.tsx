import React, { createContext, useMemo } from "react";
import { Options } from "../interfaces";
import { createOptions } from "./createOptions";
import { createManagerStore, ManagerStore } from "../manager/store";
import { Nodes, ManagerEvents } from "../interfaces";
import { ROOT_NODE } from "craftjs-utils";
import { Canvas } from "../nodes";
import { transformJSXToNode } from "../utils/transformJSX";

export type ManagerContext = ManagerStore & {
  handlers: any
}

export type ManagerContextIntializer = {
  nodes?: Nodes,
  events?: ManagerEvents,
  options?: Partial<Options>

}

export const createManagerContext = (
  data: ManagerContextIntializer = {
    nodes: {
      [ROOT_NODE]: transformJSXToNode(<Canvas is="div" />)
    },
    events: {
      active: null,
      hover: null,
      dragging: null,
      placeholder: null
    },
    options: {}
  }
) => {
  const { nodes, events, options } = data;

  return {
    ...createManagerStore(nodes, events, createOptions(options)),
    handlers: {}
  }
}

export const ManagerContext = createContext<ManagerContext>(null);
export const ManagerContextProvider: React.FC<{ context?: ManagerContext}> = ({ children, context }) => {

  const newContext = context ? context : createManagerContext();

  return (
    <ManagerContext.Provider value={newContext}>
      {children}
    </ManagerContext.Provider>
  )
}