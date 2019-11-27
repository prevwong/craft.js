import React, { createContext, useMemo } from "react";
import { LayersDND } from "./LayersDND";
import {createReduxMethods, SubscriberAndCallbacksFor } from "craftjs-utils";
import { LayerMethods } from "./LayerMethods";
import { LayerOptions } from "./interfaces";
import { DefaultLayerNode } from "./DefaultLayerNode";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export const LayerContext = createContext<{store: LayerStore }>(null);


export const createLayersStore = (options: Partial<LayerOptions>) => createReduxMethods(LayerMethods, {
    layers: {},
    events: {
        active: null,
        dragging: null,
        hover: null,
    },
    options: {
        renderLayerNode: DefaultLayerNode,
        ...options
    }
});

export const LayerContextProvider: React.FC<{options: Partial<LayerOptions>}> = ({children, options}) => {
    const store = createLayersStore(options)
    
    return (
        <LayerContext.Provider value={{store}}>
            <LayersDND>
                {children}
            </LayersDND>
        </LayerContext.Provider>
    )
}