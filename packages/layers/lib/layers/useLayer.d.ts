/// <reference types="react" />
import { Layer } from '../interfaces';
export declare function useLayer<S = null>(collect?: (layer: Layer) => S): {
    id: string;
    depth: number;
    children: string[];
    actions: {
        toggleLayer: () => void;
    };
    connectors: import("craftjs-utils-meetovo").ChainableConnectors<{
        layer: (el: HTMLElement) => HTMLElement;
        drag: (el: HTMLElement) => HTMLElement;
        layerHeader: (el: HTMLElement) => HTMLElement;
    }, HTMLElement | import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, any>) | (new (props: any) => import("react").Component<any, any, any>)>>;
} & Pick<{
    store: import("craftjs-utils-meetovo").SubscriberAndCallbacksFor<(state: import("../interfaces").LayerState) => {
        setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
        registerLayer: (id: string) => void;
        setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
        toggleLayer: (id: string) => void;
        setIndicator: (indicator: any) => void;
    }, any>;
} & import("craftjs-utils-meetovo").ConditionallyMergeRecordTypes<S, {
    actions: {
        setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
        setIndicator: (indicator: any) => void;
        setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
        registerLayer: (id: string) => void;
        toggleLayer: (id: string) => void;
    } & {
        history: {
            undo: () => void;
            redo: () => void;
            clear: () => void;
            throttle: (rate?: number) => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
            merge: () => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
            ignore: () => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
        };
    };
    query: {} | ({
        [x: string]: (...payload: any[]) => any;
    } & {
        history: {
            canUndo: () => boolean;
            canRedo: () => boolean;
        };
    });
}>, "store" | Exclude<keyof import("craftjs-utils-meetovo").ConditionallyMergeRecordTypes<S, {
    actions: {
        setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
        setIndicator: (indicator: any) => void;
        setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
        registerLayer: (id: string) => void;
        toggleLayer: (id: string) => void;
    } & {
        history: {
            undo: () => void;
            redo: () => void;
            clear: () => void;
            throttle: (rate?: number) => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
            merge: () => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
            ignore: () => Pick<{
                setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
                setIndicator: (indicator: any) => void;
                setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
                registerLayer: (id: string) => void;
                toggleLayer: (id: string) => void;
            }, "setDOM" | "setIndicator" | "setLayerEvent" | "registerLayer" | "toggleLayer">;
        };
    };
    query: {} | ({
        [x: string]: (...payload: any[]) => any;
    } & {
        history: {
            canUndo: () => boolean;
            canRedo: () => boolean;
        };
    });
}>, "actions">>;
