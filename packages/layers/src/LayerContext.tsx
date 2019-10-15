import React, { createContext, useMemo } from "react";
import { LayersDND } from "./LayersDND";
import {createReduxMethods, SubscriberAndCallbacksFor } from "craftjs-utils";
import { LayerMethods } from "./LayerMethods";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export const LayerContext = createContext<{store: LayerStore }>(null);


export const createLayersStore = () => createReduxMethods(LayerMethods, {
    layers: {},
    events: {
        active: null,
        dragging: null,
        hover: null,
    }
});

export const LayerContextProvider: React.FC = ({children}) => {
    const store = useMemo(() => {
        return createLayersStore();
    }, []);
    
    return (
        <LayerContext.Provider value={{store}}>
            <LayersDND></LayersDND>
            {children}
        </LayerContext.Provider>
    )
}