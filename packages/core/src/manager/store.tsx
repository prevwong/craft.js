import { createReduxMethods, SubscriberAndCallbacksFor } from "craftjs-utils";
import { NodeRefEvent, ManagerState, ManagerEvents, Options } from "../interfaces";
import Actions from "./actions";
import { QueryMethods } from "./query";

export type ManagerStore = SubscriberAndCallbacksFor<typeof Actions>

export const createManagerStore = (
  nodes = {}, 
  events: ManagerEvents = {
    active: null, 
    dragging: null, 
    hover:null, 
    placeholder:null
  },
  options: Partial<Options> = {}
): ManagerStore => createReduxMethods(
    Actions, 
    {
      nodes,
      events
    },
    {
      methods: QueryMethods,
      options
    }
);
