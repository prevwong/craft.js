import React from "react";
import BuilderContext from "~packages/core/BuilderContext";
import { nodesToTree, getDeepChildrenNodes, moveNode } from "~packages/core/utils";
import RenderTreeNode from "./RenderTreeNode";
import styled from "styled-components";
import { NodeId, CanvasNode, BuilderContextState, Node, Nodes } from "~types";
import LayerContext from "./context";
import { findPosition } from "./helper";
import { DropTreeNode, LayerState } from "./types";

export default class Layers extends React.Component {
  layerInfo: any = {}
  state: LayerState = {
    dragging: null,
    placeholder: null
  }
  onMouseUp: EventListenerOrEventListenerObject = this.mouseup.bind(this);
  blockSelectionWrapper: EventListenerOrEventListenerObject = this.blockSelection.bind(this);

  blockSelection(e: MouseEvent) {
    const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
    if (!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();
    e.preventDefault();
  }

  setDragging(id: NodeId) {
    this.setState((state: LayerState) => {
      state.dragging = id;
      return state;
    })
  }

  getNearestTarget(e: React.MouseEvent) {
    const { layerInfo } = this;
    const { active, nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = getDeepChildrenNodes(nodes, active.id);
    const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
      return nodeId && !deepChildren.includes(nodeId)
    });

    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, height } = layerInfo[nodeId];
      return (
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  mouseup(e: React.MouseEvent) {
    const { dragging, placeholder } = this.state;
    
    if (dragging){
      const { nodes, setNodes } = this.context;
      const { nodeId, where } = placeholder;
      let parentId: NodeId, index: number;
      if ( where === "inside" ) {
        parentId = nodeId,
        index = (nodes[parentId] as CanvasNode).nodes.length;
      } else {
        parentId = nodes[nodeId].parent;
        index = nodes[parentId].nodes.indexOf(nodeId) + (where === "after" ? 1 : 0);
      }
      
      setNodes((prevNodes: Nodes) => {
        return moveNode(prevNodes, dragging, parentId, index + (where === "after" ? 1 : 0));
      })
      this.setState({ dragging: null, placeholder: null })
    }
  }
  componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp);
  }
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("selectstart", this.blockSelectionWrapper);
  }

  render() {
    const { dragging, placeholder } = this.state;
    const { setDragging, layerInfo } = this;
    // if (dragging) window.addEventListener("mousemove", this.onDrag);
    // else window.removeEventListener("mousemove", this.onDrag);

    return (
      <BuilderContext.Consumer>
        {(builder) => {
          const tree = nodesToTree(builder.nodes);
          const { active, nodes } = builder;
          return tree &&

            <LayerContext.Provider value={{
              layerInfo,
              setDragging: setDragging.bind(this),
              dragging,
              builder,
              placeholder
            }}>
              <List
                onMouseMove={(e) => {
                  window.addEventListener("selectstart", this.blockSelectionWrapper);
                  if (dragging) {
                    if (active) {
                      const nearestTargets = this.getNearestTarget(e),
                        nearestTargetId = nearestTargets.pop();
                      let placeholder: DropTreeNode;

                      if (nearestTargetId) {
                        const targetNode = nodes[nearestTargetId],
                          targetParent: CanvasNode = (targetNode as CanvasNode).nodes ? targetNode : nodes[targetNode.parent],
                          targetParentInfo = layerInfo[targetParent.id];

                        if ((targetNode as CanvasNode).nodes && e.clientY > (targetParentInfo.y) && e.clientY < (targetParentInfo.bottom - targetParentInfo.height * 1 / 4)) {
                          placeholder = {
                            nodeId: targetNode.id,
                            where: "inside"
                          }
                        } else {
                          const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
                            return {
                              id,
                              ...layerInfo[id]
                            }
                          });

                          placeholder = findPosition(targetParent, dimensionsInContainer, e.clientY);

                        }

                        this.setState({
                          placeholder
                        })

                      }
                    }
                  }
                }}
              >
                <RenderTreeNode node={tree} />
              </List>
            </LayerContext.Provider>
        }}
      </BuilderContext.Consumer>
    )
  }
}


export const List = styled.ul`
 float:left;
 width:100%;
 background-color: #fefefe;
 padding: 0;
 margin:0;
 li {
   > div {
     padding-left: 10px;
   }
 }
`

Layers.contextType = BuilderContext;