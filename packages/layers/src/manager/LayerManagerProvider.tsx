import React from "react";
import { EventManager } from "../events";
import { useReduxMethods } from "@craftjs/utils";
import { LayerMethods } from "./actions";
import { LayerOptions } from "../interfaces";
import { DefaultLayer } from "../layers";
import {LayerManagerContext} from "./context";

export const LayerManagerProvider: React.FC<{options: Partial<LayerOptions>}> = ({children, options}) => {
    const store = useReduxMethods(LayerMethods, {
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
    
    return (
        <LayerManagerContext.Provider value={{store}}>
            <EventManager>
                {children}
            </EventManager>
        </LayerManagerContext.Provider>
    )
}