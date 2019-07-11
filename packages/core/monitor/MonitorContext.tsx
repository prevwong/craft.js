import React, { createContext, useMemo } from "react";
import { MonitorReducers } from "./MonitorReducers";
import reduxMethods, { SubscriberAndCallbacksFor } from "../shared/redux-methods";

export type MonitorStore = SubscriberAndCallbacksFor<typeof MonitorReducers, null>;

export const createMonitorStore = (): MonitorStore => reduxMethods(MonitorReducers, () => {}, {
  nodes: {},
  events: {
    active: null,
    dragging: null,
    hover: null
  }
});

export const MonitorContext = createContext<SubscriberAndCallbacksFor<typeof MonitorReducers, null>>(null);
