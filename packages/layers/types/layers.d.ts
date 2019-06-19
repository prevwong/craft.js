import { Node, NodeId, BuilderContextState } from "~types";


export interface LayerState {
  dragging: NodeId,
  placeholder: DropTreeNode;
  layersCollapsed: LayerCollapsedState
}

export interface LayerCollapsedState {
  [key: string]: Boolean
}

export interface LayerContextState extends LayerState {
  builder: BuilderContextState,
  layerInfo: any,
  setDragging: Function,
  setLayerCollapse: Function;
}

export interface DropTreeNode {
  nodeId: NodeId;
  where: string;
}