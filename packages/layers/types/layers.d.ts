import { Node, NodeId, BuilderContextState } from "~types";


export interface LayerState {
  dragging: NodeId,
  placeholder: DropTreeNode;
}

export interface LayerContextState extends LayerState {
  builder: BuilderContextState,
  layerInfo: any,
  setDragging: Function
}

export interface DropTreeNode {
  nodeId: NodeId;
  where: string;
}