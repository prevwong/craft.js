import { Nodes, Node } from "./nodes";
import { ManagerMethods } from "../manager/methods";
import { QueryMethods } from "../manager/query";

export type Events = {
  active: Node,
  dragging: Node,
  hover: Node
}

export type ManagerState = {
  nodes: Nodes,
  events: Events
}

export type ConnectedManager<S = null> = S extends null ?  ManagerMethods: ManagerMethods & {query: QueryMethods} & S ;
