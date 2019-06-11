import {
  id,
  DOMInfo,
  DropAction
} from "~types";
import { NodeInfo, Node, Nodes, NodeId } from "~types/tree";

const findPosition = (
  parent: Index,
  dims: NodeInfo[],
  posX: number,
  posY: number
) => {
  let result: DropAction = {
    parent,
    index: 0,
    where: "before"
  };

  let leftLimit = 0,
    xLimit = 0,
    dimRight = 0,
    yLimit = 0,
    xCenter = 0,
    yCenter = 0,
    dimDown = 0,
    dim = null,
    id = null;
  // Each dim is: Top, Left, Height, Width
  for (var i = 0, len = dims.length; i < len; i++) {
    dim = dims[i].dom;
    id = dims[i].id as id;

    // Right position of the element. Left + Width
    dimRight = dim.left + dim.width;
    // Bottom position of the element. Top + Height
    dimDown = dim.top + dim.height;
    // X center position of the element. Left + (Width / 2)
    xCenter = dim.left + dim.width / 2;
    // Y center position of the element. Top + (Height / 2)
    yCenter = dim.top + dim.height / 2;
    // Skip if over the limits
    if (
      (xLimit && dim.left > xLimit) ||
      (yLimit && yCenter >= yLimit) || // >= avoid issue with clearfixes
      (leftLimit && dimRight < leftLimit)
    )
      continue;

    result.index = i;
    // If it's not in flow (like 'float' element)
    if (!dim.inFlow) {
      if (posY < dimDown) yLimit = dimDown;
      //If x lefter than center
      if (posX < xCenter) {
        xLimit = xCenter;
        result.where = "before";
      } else {
        leftLimit = xCenter;
        result.where = "after";
      }
    } else {
      // If y upper than center
      if (posY < yCenter) {
        result.where = "before";
        break;
      } else result.where = "after"; // After last element
    }
  }

  return result;
};

const movePlaceholder = (
  pos: DropAction,
  droppableDomInfo: DOMInfo, // which droppable is cursor at
  bestTargetDomInfo: DOMInfo // closest element in droppable (null if droppable is empty)
) => {
  let marg = 0,
    t = 0,
    l = 0,
    w = 0,
    h = 0,
    margin = {},
    margI = 5,
    brd = 3,
    where = pos.where;

  const elDim = bestTargetDomInfo ? bestTargetDomInfo : null;

  margin = {
    top: -brd,
    left: 0,
    bottom: 0,
    right: 0
  };

  if (elDim) {
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = null;
      h = elDim.height - marg * 2;
      t = elDim.top + marg;
      l =
        where == "before" ? elDim.left - marg : elDim.left + elDim.width - marg;
      margin = {
        top: 0,
        left: -brd,
        bottom: 0,
        right: 0
      };
    } else {
      w = elDim.width;
      h = null;
      t =
        where == "before" ? elDim.top - marg : elDim.top + elDim.height - marg;
      l = elDim.left;
    }
  } else {
    if (droppableDomInfo) {
      t = droppableDomInfo.top + margI;
      l = droppableDomInfo.left + margI;
      w = droppableDomInfo.width - margI * 2;
      h = null;
    }
  }

  return {
    top: t,
    left: l,
    width: w,
    height: h,
    margin
  };
};

const getNearestTarget = (
  e: MouseEvent,
  nodes: Nodes,
  dragNode: Node
) => {
  const pos = { x: e.clientX, y: e.clientY };
  const { canvas } = dragNode;
  const nodesWithinBounds = canvas ? (Object.keys(nodes).filter(id => {
    // don't include children of current node; do not want to drop our current element into it's children
    return (
      !canvas.includes(id)
    );
  })) : Object.keys(nodes);

  return nodesWithinBounds.filter((nodeId: NodeId) => {
    const { info } = nodes[nodeId];
    const { dom, id } = info;
    const { top, left, width, height } = dom;
    return (
      (pos.x >= left && pos.x <= left + width) &&
      (pos.y >= top && pos.y <= top + height)
    );
  });
};

export const placeBestPosition = (
  nodes: Nodes,
  dragTarget: Node,
  e: MouseEvent
) => {
  const nearestTargets = getNearestTarget(e, nodes, dragTarget),
    nearestTargetId = nearestTargets.pop();
  if (nearestTargetId) {
    const targetNode = nodes[nearestTargetId],
      targetParent = targetNode.parent,
      targetParentInfo = targetParent.info;

    // const targetIndex = tree.getIndex(nearestTarget.id),
    //   targetParent = targetIndex.children
    //     ? targetIndex
    //     : tree.getIndex(targetIndex.parent),
    //   targetParentInfo = tree.getInfo(targetParent.id);

    // const dimensionsInContainer = tree.getChildInfo(false, targetParent.id);

    // const bestTarget = findPosition(
    //   targetParent,
    //   dimensionsInContainer,
    //   e.clientX,
    //   e.clientY
    // );

    // const bestTargetNode = tree.get(targetParent.children[bestTarget.index]);

    // return {
    //   position: movePlaceholder(
    //     bestTarget,
    //     targetParentInfo.dom,
    //     targetParent.children.length
    //       ? tree.getInfo(bestTargetNode.id).dom
    //       : null
    //   ),
    //   node: bestTargetNode,
    //   placement: bestTarget
    // };
  }

  return null;
};
