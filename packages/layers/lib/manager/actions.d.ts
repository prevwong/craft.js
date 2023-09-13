import { LayerState, LayerEvents } from '../interfaces';
export declare const LayerMethods: (state: LayerState) => {
    setLayerEvent: (eventType: LayerEvents, id: string) => void;
    registerLayer: (id: string) => void;
    setDOM: (id: string, domCollection: Partial<Record<"dom" | "headingDom", HTMLElement>>) => void;
    toggleLayer: (id: string) => void;
    setIndicator: (indicator: any) => void;
};
