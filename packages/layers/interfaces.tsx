import { NodeId } from "~packages/core";

export type Layer = {
  id: NodeId,
  dom?: HTMLElement,
  headingDom?: HTMLElement,
  expanded?: boolean
};

export type LayerEvents = 'active' | 'hover';

export type LayerState = {
  layers: Record<NodeId, Layer>,
  events: Record<LayerEvents, Layer>
}
