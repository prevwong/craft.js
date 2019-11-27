import { NodeId } from "craftjs";
import { ConnectorElementWrapper } from "craftjs-utils";

export type Layer = {
  id: NodeId,
  dom?: HTMLElement,
  headingDom?: HTMLElement,
  expanded?: boolean
};

export type LayerEvents = 'active' | 'hover';


export type LayerNodeProps = {
  id: NodeId;
  connectDrag: ConnectorElementWrapper
  connectToggle: ConnectorElementWrapper
};

export type LayerOptions = {
  renderLayerNode: React.ElementType<LayerNodeProps>
}

export type LayerState = {
  layers: Record<NodeId, Layer>,
  events: Record<LayerEvents, Layer>
  options: LayerOptions
}
