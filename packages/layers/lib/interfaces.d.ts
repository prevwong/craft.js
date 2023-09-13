/// <reference types="react" />
import { NodeId, Indicator } from '@craftjs/core';
export declare type Layer = {
    id: NodeId;
    dom: HTMLElement;
    headingDom: HTMLElement;
    expanded: boolean;
    event: LayerRefEvents;
};
export declare type LayerRefEvents = Record<LayerEvents, boolean>;
export declare type LayerEvents = 'selected' | 'hovered';
export declare type LayerOptions = {
    expandRootOnLoad: boolean;
    renderLayer: React.ElementType;
};
export declare type LayerIndicator = Indicator & {
    onCanvas: boolean;
};
export declare type LayerState = {
    layers: Record<NodeId, Layer>;
    events: Record<LayerEvents, NodeId | null> & {
        indicator: LayerIndicator;
    };
    options: LayerOptions;
};
