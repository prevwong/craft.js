import { NodeId } from "craftjs";
import { ConnectorElementWrapper } from "craftjs-utils";

export type Layer = {
  id: NodeId,
  depth?: number;
  dom?: HTMLElement,
  headingDom?: HTMLElement,
  expanded?: boolean
  event?: LayerRefEvents
};

export type LayerRefEvents = Record<LayerEvents, boolean>;

export type LayerEvents = 'active' | 'hover';

export type LayerOptions = {
  renderLayer: React.ElementType;
  renderLayerHeader: React.ElementType;
}

export type LayerState = {
  layers: Record<NodeId, Layer>,
  events: Record<LayerEvents, NodeId>
  options: LayerOptions
}
