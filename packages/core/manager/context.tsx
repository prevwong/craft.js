import React, { useContext } from "react";
import useMethods, { StateAndCallbacksFor } from "use-methods";
import methods from "./methods";
import reduxMethods, { SubscriberAndCallbacksFor } from "../shared/redux-methods";
import { QueryMethods } from "./query";

export type ManagerStore = SubscriberAndCallbacksFor<typeof methods, typeof QueryMethods>;
export const ManagerContext = React.createContext<StateAndCallbacksFor<typeof methods> | null>(null);

export const createManagerStore = (): ManagerStore => reduxMethods(methods, QueryMethods, {
  nodes: {},
  events: {
    active: null,
    dragging: null,
    hover: null
  }
});
