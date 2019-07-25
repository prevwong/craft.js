import React, { useContext } from "react";
import methods from "./methods";
import createReduxMethods, {SubscriberAndCallbacksFor} from "../../shared/createReduxMethods";

export type ManagerStore = SubscriberAndCallbacksFor<typeof methods>;
export const ManagerContext = React.createContext<SubscriberAndCallbacksFor<typeof methods> | null>(null);

export const createManagerStore = (): ManagerStore => createReduxMethods(methods, {
  nodes: {},
  events: {
    active: null,
    dragging: null,
    hover: null,
    placeholder: null
  }
});
