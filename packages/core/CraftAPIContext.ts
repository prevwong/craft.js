import React from "react";
import { DOMInfo, Nodes, Node } from "~types";


export interface NodeEvent {
  node: Node,
  info: DOMInfo
}

export interface MouseEvents {
  active: NodeEvent | null
  dragging: NodeEvent | null
  hover: NodeEvent | null
}

export interface CraftAPIMethods {
  add: Function;
  delete: Function;
  move: Function;
  setActiveNode: Function
}

export interface CraftAPIContext {
  events: MouseEvents | undefined,
  nodes: Nodes | undefined,
  methods: CraftAPIMethods | undefined
}

export const CraftAPIContext = React.createContext<CraftAPIContext>({
  events: undefined,
  nodes: undefined,
  methods: undefined
});

export function createAPIContext(events: MouseEvents, nodes: Nodes, methods: CraftAPIMethods): CraftAPIContext {
  return {
    events,
    nodes,
    methods
  }
}