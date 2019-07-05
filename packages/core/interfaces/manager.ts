import { Nodes, Node } from "./nodes";
import { ManagerMethods } from "../manager/methods";
import { QueryMethods } from "../manager/query";


export type ManagerState = {
  nodes: Nodes,
  events: {
    active: Node,
    dragging: Node,
    hover: Node
  }
}

export type ConnectedManager<S = null> = S extends null ?  ManagerMethods: ManagerMethods & {query: QueryMethods} & S ;
