import React from "react";
import { Nodes } from "~types";

export interface PublicManagerMethods {
  add: Function;
  remove: Function;
  move: Function;
}

export interface RootManagerMethods extends PublicManagerMethods {
  setNodes: Function
}

interface Manager {
  nodes: Nodes
}

export interface RootManagerContext extends Manager {
  methods: RootManagerMethods
}

export interface PublicManagerContext extends Manager {
  methods: PublicManagerMethods
}

export type NodeManagerContext<T extends RootManagerContext | PublicManagerContext> = T;


export const NodeManagerContext = React.createContext<NodeManagerContext<RootManagerContext>>({
  nodes: null,
  methods: {
    add: null,
    move: null,
    remove: null,
    setNodes: null
  }
});

