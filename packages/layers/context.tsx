import React, { createContext, useReducer } from "react";
import produce from "immer";
import { LayersDND } from "./LayersDND";

export const LayerContext = createContext(null);

const reducer = (state, action) => produce(state, draft => {
    switch(action.type) {
        case 'SET_LAYER_EVENT':
            draft.events[action.event] = action.layer.id;
            break;
        case 'REGISTER_LAYER':
            console.log("Registereing")
            draft.layers[action.layer.id] = action.layer;
            break;
    }
})

export const LayerContextProvider: React.FC = ({children}) => {
    const [state, dispatch] = useReducer(reducer, {
        layers: {},
        events: {
            active: null,
            hover: null,
            dragging: null
        }
    });    

    console.log(state)
    return (
        <LayerContext.Provider value={dispatch}>
            <LayersDND {...state}></LayersDND>
            {children}
        </LayerContext.Provider>
    )
}