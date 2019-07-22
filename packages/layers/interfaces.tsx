import { NodeId, NodeData } from "~packages/core";

export type Layer = {
  id: NodeId,
  dom: HTMLElement,
  headingDom: HTMLElement,
  data: NodeData,
  expanded: boolean
};

export type LayerEvents = 'active' | 'hover';

export type LayerState = {
  layers: Record<NodeId, Layer>,
  events: Record<LayerEvents, Layer>
}

export type Actions = {
  type: 'SET_LAYER_EVENT',
  event: LayerEvents,
  layer: NodeId
} | {
  type: 'REGISTER_LAYER',
  layer: Layer
}