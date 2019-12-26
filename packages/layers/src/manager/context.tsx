import React, { createContext, useMemo } from "react";
import { EventManager } from "../events";
import { useReduxMethods, SubscriberAndCallbacksFor } from "@craftjs/utils";
import { LayerMethods } from "./actions";
import { LayerOptions } from "../interfaces";
import { DefaultLayer } from "../layers";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export const LayerManagerContext = createContext<{store: LayerStore }>(null);


export const createLayersStore = (options: Partial<LayerOptions>) => useReduxMethods(LayerMethods, {
    layers: {},
    events: {
        selected: null,
        dragged: null,
        hovered: null,
    },
    options: {
        renderLayer: DefaultLayer, 
        ...options
    }
});

export const LayerManagerContextProvider: React.FC<{options: Partial<LayerOptions>}> = ({children, options}) => {
    const store = createLayersStore(options)
    
    return (
        <LayerManagerContext.Provider value={{store}}>
            <EventManager>
                {children}
            </EventManager>
        </LayerManagerContext.Provider>
    )
}