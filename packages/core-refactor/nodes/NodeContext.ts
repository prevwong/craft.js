import React from "react";
import { Node } from "~types";
import { MouseEvents, CraftAPIContext } from "../CraftAPIContext";

export interface NodeContext {
  node: Node;
  events: MouseEvents;
  api: CraftAPIContext
}

export const NodeContext = React.createContext<NodeContext>({
  node: null,
  events: null,
  api: null
});
