import React, { useContext } from "react";
import useMethods, { StateAndCallbacksFor } from "use-methods";
import methods from "./methods";
import { QueryMethods } from "./query";
import createReduxMethods, {SubscriberAndCallbacksFor} from "../../shared/createReduxMethods";

export type ManagerStore = SubscriberAndCallbacksFor<typeof methods>;
export const ManagerContext = React.createContext<StateAndCallbacksFor<typeof methods> | null>(null);

export const createManagerStore = (): ManagerStore => createReduxMethods(methods, {
  nodes: {},
  events: {
    active: null,
    dragging: null,
    hover: null,
    placeholder: null
  }
});
