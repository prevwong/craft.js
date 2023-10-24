import { NodeId, Node, DerivedCoreEventHandlers } from '@craftjs/core';
import { LayerIndicator } from '../interfaces';
export declare class LayerHandlers extends DerivedCoreEventHandlers<{
    layerStore: any;
}> {
    static draggedElement: any;
    static events: {
        indicator: LayerIndicator;
        currentCanvasHovered: Node;
    };
    getLayer(id: NodeId): any;
    handlers(): {
        layer: (el: HTMLElement, layerId: string) => () => void;
        layerHeader: (el: HTMLElement, layerId: string) => void;
        drag: (el: HTMLElement, layerId: string) => () => void;
    };
}
