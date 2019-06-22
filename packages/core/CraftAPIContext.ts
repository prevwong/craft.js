import React from "react";
import { NodeManagerContext, RootManagerContext, PublicManagerContext } from "./nodes/NodeManagerContext";
import { EventContext, RootEventContext, PublicEventContext } from "./events/EventContext";


export interface CraftAPIContext {
  events: EventContext<PublicEventContext>,
  manager: NodeManagerContext<PublicManagerContext>,

}

export const CraftAPIContext = React.createContext<CraftAPIContext>({
  manager: undefined,
  events: undefined
});

export function createAPIContext(manager: NodeManagerContext<RootManagerContext>, events: EventContext<RootEventContext>): CraftAPIContext {
  const {nodes, methods: {setNodes, ...managerMethods}} = manager;
  const {methods: {setNodeEvent, ...eventMethods}, active, dragging, hover} = events;
  return {
    manager: {
      nodes,
      methods: managerMethods
    },
    events: {
      active,
      dragging, 
      hover,
      methods: eventMethods
    }
  }
}