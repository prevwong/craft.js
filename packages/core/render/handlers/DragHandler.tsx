import React, { SyntheticEvent } from "react";
import { NodeContext } from "~packages/core/nodes";
import { CanvasNode, Nodes, BuilderContextState } from "~types";
import { moveNode } from "~packages/core/utils";

export default class DragHandler extends React.Component {
    dragStartWrapper: EventListenerOrEventListenerObject = this.dragStart.bind(this);
    dragWatchWrapper: EventListenerOrEventListenerObject = this.dragWatch.bind(this);
    dragEndWrapper: EventListenerOrEventListenerObject = this.dragEnd.bind(this);
    blockSelectionWrapper: EventListenerOrEventListenerObject = this.blockSelection.bind(this);
    blockSelection(e: MouseEvent) {
      const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
      if(!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();
      e.preventDefault();
    }
    dragStart(e: React.MouseEvent) {
      e.stopPropagation();
      if (e.nativeEvent.which !== 1) return;
      console.log('drag start2')
      window.addEventListener("mousemove", this.dragWatchWrapper);
      window.addEventListener("mouseup", this.dragEndWrapper);
      window.addEventListener("selectstart", this.blockSelectionWrapper);
    }
    dragWatch(e: MouseEvent) {
      const {node, builder} = this.context;
      const { dragging, setNodeState } = builder;
      const { left, right, top, bottom } = builder.nodesInfo[node.id]
      if (
        !(
          e.clientX >= right &&
          e.clientY >= top &&
          e.clientY <= bottom
        ) &&
        !dragging
      ) {
        // Element being dragged
        setNodeState("dragging", node.id);
      }
    }
  
    dragEnd(e: MouseEvent) {
      window.removeEventListener("mouseup", this.dragEndWrapper);
      window.removeEventListener("mousemove", this.dragWatchWrapper);
      window.removeEventListener("selectstart", this.blockSelectionWrapper);
  
      const {node, builder} = this.context;
      const {  dragging, placeholder, setNodeState, setNodes }: BuilderContextState = builder;
      if (!dragging) return;
  
      const { id: dragId, parent: dragParentId } = dragging;
      const { placement } = placeholder;
      const { parent, index, where } = placement;
      const { id: parentId, nodes } = parent;
      
      setNodes((stateNodes: Nodes) => {
        // const currentParentNodes = (stateNodes[dragParentId] as CanvasNode).nodes;
        //   currentParentNodes.splice(currentParentNodes.indexOf(dragId), 1);
        // const newParentNodes = (stateNodes[parentId] as CanvasNode).nodes;
  
        // newParentNodes.splice(index + (where === "after" ? 1 : 0), 0, dragId);
        // stateNodes[dragId].parent = parentId;
        // return stateNodes;
        return moveNode(stateNodes, dragId, parentId, index + (where === "after" ? 1 : 0));
      });
  
      setNodeState("dragging", null);
    }
  
    render() {
      const {is: Comp} = this.props;
      return (
        <NodeContext.Consumer>
          {({node}) => {
            return (
              node.parent && 
                <Comp onMouseDown={this.dragStartWrapper}>
                  {this.props.children}
                </Comp>
            )
          }}
        </NodeContext.Consumer>
        
      )
    }
  }
  DragHandler.contextType = NodeContext;