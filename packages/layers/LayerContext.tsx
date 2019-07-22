import React, { createContext, useReducer, useMemo } from "react";
import produce from "immer";
import { LayersDND } from "./LayersDND";
import { Actions, LayerState } from "./interfaces";
import createReduxMethods, { SubscriberAndCallbacksFor, StateFor, Methods } from "~packages/shared/createReduxMethods";
import { LayerMethods } from "./LayerMethods";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export const LayerContext = createContext<{store: LayerStore }>(null);


const reducer = (state: LayerState, action: Actions) => produce(state, (draft: LayerState) => {
    switch (action.type) {
        case 'SET_LAYER_EVENT':
            const current = state.events[action.event];
            if (current) {
                draft.events[action.event] = null;
            }
            draft.events[action.event] = state.layers[action.layer]
            break;
        case 'REGISTER_LAYER':
            draft.layers[action.layer.id] = action.layer;
            break;
    }
});


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