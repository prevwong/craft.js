import createReduxMethods, {SubscriberAndCallbacksFor} from "../../shared/createReduxMethods";
import { NodeRefEvent, ManagerState, ManagerEvents } from "../interfaces";
import Actions from "./actions";

export type ManagerStore = SubscriberAndCallbacksFor<typeof Actions>;

export const createManagerStore = (
  nodes = {}, 
  events: ManagerEvents = {
    active: null, 
    dragging: null, 
    hover:null, 
    placeholder:null
  }): ManagerStore => createReduxMethods(Actions, {
  nodes,
  events
});
