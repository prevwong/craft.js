import React, { Component } from "react";
import { DropAction, BuilderContextState, Nodes, NodeId, CanvasNode, PlaceholderInfo } from "~types";
import BuilderContext from "../BuilderContext";
import { isCanvas, getDeepChildrenNodes } from "../utils";
import Canvas from "../nodes/Canvas";
import Placeholder from "./Placeholder";
import { movePlaceholder, findPosition } from "./helper";

export const DNDContext = React.createContext<any>({});
class DragDropManager extends Component {
  nodesInfo: any = {};
  dragging: NodeId = null;
  lastPos: DropAction;
  onDrag: EventListenerOrEventListenerObject;
  onMouseup: EventListenerOrEventListenerObject;
  blockSelectionWrapper: EventListenerOrEventListenerObject = this.blockSelection.bind(this);
  blockSelection(e: MouseEvent) {
    const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
    if(!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();
    e.preventDefault();
  }
  nodes: Nodes;
  state = {
    placeholder: null
  }
  constructor(props: any, context: BuilderContextState) {
    super(props);
    this.nodes = context.nodes;
    this.onDrag = this.drag.bind(this);
    this.onMouseup = this.mouseup.bind(this);
  }

  setPlaceholder = (placeholder: PlaceholderInfo) => {
    this.setState({
      placeholder
    });
  }

  drag(e: MouseEvent) {
    e.stopPropagation();
    const { dragging, setNodeState} = this.context;
    const { left, right, top, bottom } = this.nodesInfo[this.dragging]
    if (
      !(
        e.clientX >= right &&
        e.clientY >= top &&
        e.clientY <= bottom
      ) &&
      !dragging
    ) {
      // Element being dragged
      setNodeState("dragging", this.dragging);
    } else {
      if ( dragging ) {
        this.placeBestPosition(e);
      }
    }
  }


  placeBestPosition(e: MouseEvent) {
    const { nodesInfo } = this;
    const { nodes, dragging }: BuilderContextState = this.context;
    const nearestTargets = this.getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();

    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent: CanvasNode = (targetNode as Canvas).nodes ? targetNode : nodes[targetNode.parent];

      const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
        return {
          id,
          ...nodesInfo[id]
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.nodes.length ? nodes[targetParent.nodes[bestTarget.index]] : targetParent;

      const output = {
        position: movePlaceholder(
          bestTarget,
          nodesInfo[targetParent.id],
          targetParent.nodes.length
            ? nodesInfo[bestTargetNode.id]
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };
      
      this.setPlaceholder(output);
    }
  }

  getNearestTarget(e: MouseEvent) {
    const { nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };
    
    const deepChildren =  getDeepChildrenNodes(nodes, this.dragging);
    const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
      return nodeId !== "rootNode" && !deepChildren.includes(nodeId)
    });
    
    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const {top, left, width, height } = this.nodesInfo[nodeId];
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  }; 

  mouseup() {
    window.removeEventListener("mousemove", this.onDrag);
    window.removeEventListener("mouseup", this.onMouseup);
    window.removeEventListener("selectstart", this.blockSelectionWrapper);
    
    const {  dragging, move, setNodeState }: BuilderContextState = this.context;
    const { placeholder } = this.state;
    if ( !dragging ) return;

    const { placement } = placeholder;
    const { parent, index, where } = placement;
    const { id: parentId, nodes } = parent;
    
    move(dragging.id, parentId, index + (where === "after" ? 1 : 0));
    this.dragging = null;
    this.setPlaceholder(null);
    setNodeState("dragging", null);
  }

  setDragging = (nodeId: NodeId) => {
    // this.setState
    this.dragging = nodeId;
    window.addEventListener("selectstart", this.blockSelectionWrapper);
    window.addEventListener("mousemove", this.onDrag);
    window.addEventListener("mouseup", this.onMouseup);
  }

  render() {
    const { setDragging, nodesInfo } = this;
    const { placeholder } = this.state;

    return (
      <DNDContext.Provider value={{
        setDragging,
        nodesInfo
      }}>
        <React.Fragment>
          {placeholder && (
            <Placeholder placeholder={placeholder} />
          )}
          {this.props.children}
        </React.Fragment>
      </DNDContext.Provider>
    );
  }
}

DragDropManager.contextType = BuilderContext;

export default DragDropManager;
