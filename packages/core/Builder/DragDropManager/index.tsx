import React, { Component } from "react";
import { DropAction, BuilderContextState, Nodes, NodeId, CanvasNode, NodeInfo, DOMInfo } from "~types";
import BuilderContext from "../BuilderContext";
import { isCanvas } from "~src/utils";
import Canvas from "~packages/core/Canvas";
import Placeholder from "./Placeholder";

class DragDropManager extends Component {
  lastPos: DropAction;
  onDrag: EventListenerOrEventListenerObject;
  nodes: Nodes;
  constructor(props: any, context: BuilderContextState) {
    super(props);
    this.nodes = context.nodes;
    this.onDrag = this.drag.bind(this);
  }

  drag(e: MouseEvent) {
    e.stopPropagation();
    const { dragging, nodes }: BuilderContextState = this.context;

    if (dragging) {
      this.placeBestPosition(e);
    }
  }


  placeBestPosition(e: MouseEvent) {
    const { nodes, setPlaceholder }: BuilderContextState = this.context;
    const nearestTargets = this.getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();

    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent: CanvasNode = (targetNode as Canvas).nodes ? targetNode : nodes[targetNode.parent];

      const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
        const { info } = nodes[id];
        return {
          id,
          ...info
        }
      })

      const bestTarget = this.findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = nodes[targetParent.nodes[bestTarget.index]];

      const output = {
        position: this.movePlaceholder(
          bestTarget,
          targetParent.info.dom,
          targetParent.nodes.length
            ? bestTargetNode.info.dom
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };

      setPlaceholder(output);
    }
  }



  movePlaceholder(
    pos: DropAction,
    canvasDOMInfo: DOMInfo, // which canvas is cursor at
    bestTargetDomInfo: DOMInfo // closest element in canvas (null if canvas is empty)
  ) {
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
        h = elDim.outerHeight - marg * 2;
        t = elDim.top + marg;
        l =
          where == "before" ? elDim.left - marg : elDim.left + elDim.outerWidth - marg;
        margin = {
          top: 0,
          left: -brd,
          bottom: 0,
          right: 0
        };
      } else {
        w = elDim.outerWidth;
        h = null;
        t =
          where == "before" ? elDim.top - marg : elDim.top + elDim.outerHeight - marg;
        l = elDim.left;
      }
    } else {
      if (canvasDOMInfo) {
        t = canvasDOMInfo.top + margI;
        l = canvasDOMInfo.left + margI;
        w = canvasDOMInfo.outerWidth - margI * 2;
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
  }

  findPosition(
    parent: CanvasNode,
    dims: NodeInfo[],
    posX: number,
    posY: number
  ) {
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
      id = dims[i].id as NodeId;

      // Right position of the element. Left + Width
      dimRight = dim.left + dim.outerWidth;
      // Bottom position of the element. Top + Height
      dimDown = dim.top + dim.outerHeight;
      // X center position of the element. Left + (Width / 2)
      xCenter = dim.left + dim.outerWidth / 2;
      // Y center position of the element. Top + (Height / 2)
      yCenter = dim.top + dim.outerHeight / 2;
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
  }

  getNearestTarget(e: MouseEvent) {
    const { dragging, nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };
    const nodesWithinBounds = isCanvas(dragging) ? Object.keys(nodes).filter(id => {
      return !(dragging as CanvasNode).nodes.includes(id) && id !== "rootNode";
    }) : Object.keys(nodes).filter(id => id !== "rootNode");

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

  render() {
    return (
      <BuilderContext.Consumer>
        {({ dragging, placeholder, active }: BuilderContextState) => {
          if (dragging) window.addEventListener("mousemove", this.onDrag);
          else window.removeEventListener("mousemove", this.onDrag);
          return (
            <React.Fragment>
              {placeholder && (
                <Placeholder isActive={!!dragging} placeholder={placeholder} />
              )}
              {this.props.children}
            </React.Fragment>
          );
        }}
      </BuilderContext.Consumer>
    );
  }
}

DragDropManager.contextType = BuilderContext;

export default DragDropManager;
