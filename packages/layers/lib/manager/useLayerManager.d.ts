import { LayerState } from '../interfaces';
export declare function useLayerManager<C>(collector?: (state: LayerState) => C): {
    store: import("craftjs-utils-meetovo").SubscriberAndCallbacksFor<(state: LayerState) => {
        setLayerEvent: (eventType: import("../interfaces").LayerEvents, id: string) => void;
        registerLayer: (id: string) => void;
        setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
        toggleLayer: (id: string) => void;
        setIndicator: (indicator: any) => void;
    }, any>;
} & import("craftjs-utils-meetovo").ConditionallyMergeRecordTypes<C, {
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
}>;
