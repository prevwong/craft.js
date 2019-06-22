import React from "react";
import { NodeEvent } from "../CraftAPIContext";


export interface EventContext {
  setNodeEvent: Function;
  nodesInfo: any; 
  active: NodeEvent;
  dragging: NodeEvent;
  hover: NodeEvent;
}

const EventContext = React.createContext<EventContext>({
  setNodeEvent: undefined,
  nodesInfo: undefined,
  active: undefined,
  dragging: undefined,
  hover: undefined
});

export default EventContext;