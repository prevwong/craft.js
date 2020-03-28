import { createContext } from "react";
import { SubscriberAndCallbacksFor } from "@candulabs/craft-utils";
import { LayerMethods } from "./actions";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export type LayerManagerContext = {
  store: LayerStore;
};

export const LayerManagerContext = createContext<LayerManagerContext>(
  {} as LayerManagerContext
);
