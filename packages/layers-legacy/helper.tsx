import { NodeId, DropAction, CanvasNode, NodeInfo, Nodes, Node } from "~types";
import { DropTreeNode } from "./types";

export const findPosition = (
  parentNode: CanvasNode,
  dims: NodeInfo[],
  posY: number
) => {
  let result: DropTreeNode = {
    nodeId: parentNode.nodes[0],
    where: "before"
  };

  let yLimit = 0,
    yCenter = 0,
    dim = null,
    index = 0,
    id = null;
  // Each dim is: Top, Left, Height, Width
  for (var i = 0, len = dims.length; i < len; i++) {
    dim = dims[i];
    id = dims[i].id as NodeId;

    yCenter = dim.top +  dim.outerHeight / 2;

    // Skip if over the limits
    if (
      (yLimit && yCenter >= yLimit) // >= avoid issue with clearfixes
    )
      continue;

    index = i;
   
    if (posY < yCenter) {
      result.where = "before";
      break;
    } else result.where = "after"; // After last element
  }

  result.nodeId = parentNode.nodes[index];
  if ( parentNode.nodes.length === 0 ) result.where === "inside";

  return result;
}

export const getNearestDraggableParent = (nodes: Nodes, id: NodeId) : Node => {
  const node = nodes[id];
  if ( node.parent ) {
    return node;
  } else {
    return getNearestDraggableParent(nodes, node.closestParent)
  }
}

export const moveNextToParent = (nodes: Nodes, layerInfo: any, posY: number, targetId: NodeId) => {
  if ( nodes[targetId].parent !== "rootNode" ) {
    const nearestDraggableParent = getNearestDraggableParent(nodes, nodes[targetId].parent),
    nearestDraggableParentInfo = layerInfo[nearestDraggableParent.id];
    if ( posY > nearestDraggableParentInfo.full.bottom - 5 ) {
      return {
        nodeId: nearestDraggableParent.id,
        where: "after"
      }
    }
  }
} 