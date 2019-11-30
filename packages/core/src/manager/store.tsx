import { useReduxMethods, SubscriberAndCallbacksFor } from "craftjs-utils";
import { NodeRefEvent, ManagerState, ManagerEvents, Options } from "../interfaces";
import Actions from "./actions";
import { QueryMethods } from "./query";

export type ManagerStore = SubscriberAndCallbacksFor<typeof Actions>

export const useManagerStore = (
  nodes = {}, 
  events: ManagerEvents = {
    active: null, 
    dragging: null, 
    hover:null, 
    placeholder:null
  },
  options: Partial<Options> = {}
): ManagerStore => {

  return useReduxMethods(
    Actions,
    {
      nodes,
      events,
      options,
    },
    QueryMethods
  );
}
