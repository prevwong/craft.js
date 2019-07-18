import React from "react";
import BuilderContext from "~packages/core/BuilderContext";
import { nodesToTree, getDeepChildrenNodes, moveNode, getAllParents } from "~packages/core/utils";
import RenderTreeNode from "./RenderTreeNode";
import styled from "styled-components";
import { NodeId, CanvasNode, BuilderContextState, Node, Nodes } from "~types";
import { findPosition, getNearestDraggableParent, moveNextToParent } from "./helper";
import { DropTreeNode, LayerState } from "./types";
import LayerContext from "./LayerContext";

export default class Layers extends React.Component {
  layerInfo: any = {}
  previousActiveLayer: NodeId = null;
  state: LayerState = {
    dragging: null,
    placeholder: null,
    layersCollapsed: {}
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
    const nodesWithinBounds = Object.keys(layerInfo).filter(nodeId => {
      return nodeId && !deepChildren.includes(nodeId) && nodes[nodeId].parent
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

    if (dragging && placeholder) {
      const { nodes, setNodes } = this.context;
      const { nodeId, where } = placeholder;
      let parentId: NodeId, index: number;
      if (where === "inside") {
        parentId = nodeId,
          index = (nodes[parentId] as CanvasNode).nodes.length;
      } else {
        parentId = nodes[nodeId].parent;
        index = nodes[parentId].nodes.indexOf(nodeId) + (where === "after" ? 1 : 0);
      }

      setNodes((prevNodes: Nodes) => {
        moveNode(prevNodes, dragging, parentId, index);
        this.expandAllParents(dragging);
      })
    }
    window.removeEventListener("selectstart", this.blockSelectionWrapper);
    this.setState({ dragging: null, placeholder: null })
  }
  componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp);
    
  }
  componentWillUnmount() {
    // window.removeEventListener("mouseup", this.onMouseUp);
    // window.removeEventListener("selectstart", this.blockSelectionWrapper);
  }

  expandAllParents(id: NodeId) {
    const { nodes } = this.context;
    const allParents = getAllParents(nodes, id);
    // console.log(id, allParents)
    this.setState((state: LayerState) => {
      allParents.forEach((id) => {
        state.layersCollapsed[id] = true;
      })
      this.previousActiveLayer = id;
      return state;
    });
  }

  componentDidUpdate() {
    const { active } = this.context;
    if ( active && active.id !== this.previousActiveLayer ) {
      this.expandAllParents(active.id);
    }
  }

  render() {
    const { dragging, placeholder, layersCollapsed } = this.state;
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
              setLayerCollapse: (id: NodeId, bool: Boolean) => {
                this.setState((state: LayerState) => {
                  state.layersCollapsed[id] = bool;
                })
              },
              dragging,
              builder,
              placeholder,
              layersCollapsed
            }}>
              <List
                onMouseMove={(e) => {
                  window.addEventListener("selectstart", this.blockSelectionWrapper);
                  if (dragging) {
                    
                    if (active) {
                      const nearestTargets = this.getNearestTarget(e),
                        nearestTargetId = nearestTargets.pop();

                      let placeholder: DropTreeNode,
                        nextToParent = moveNextToParent(nodes, layerInfo, e.clientY, dragging);

                      if (nextToParent && !nearestTargetId) {
                        placeholder = nextToParent;
                      } else {
                        if (nearestTargetId) {
                          const targetNode = nodes[nearestTargetId],
                            targetParent: CanvasNode = (targetNode as CanvasNode).nodes ? targetNode : nodes[targetNode.parent],
                            targetParentInfo = layerInfo[targetParent.id];

                          if ((targetNode as CanvasNode).nodes) {
                            let where;
                            if ( targetNode.id !== "rootNode" && e.clientY < (targetParentInfo.y + 5) ) {
                              where = "before";
                            } else if ( targetNode.id !== "rootNode" && e.clientY > targetParentInfo.full.bottom - 5 ) {
                              where =  "after";
                            } else if (  e.clientY >= (targetParentInfo.y) && e.clientY <= targetParentInfo.top + targetParentInfo.outerHeight ) {
                              where = "inside";
                            }
                            if (!where) return;
                            placeholder = {
                              nodeId: targetNode.id,
                              where
                            }
                          } else {
                            const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
                              return {
                                id,
                                ...layerInfo[id]
                              }
                            });

                            placeholder = findPosition(targetParent, dimensionsInContainer, e.clientY);
                            
                            if (placeholder.where === "after" ) {
                              if ( e.clientY < (layerInfo[placeholder.nodeId].full.bottom - 5) ) return;
                              nextToParent = moveNextToParent(nodes, layerInfo, e.clientY, placeholder.nodeId);
                              if (nextToParent) placeholder = nextToParent;
                            } else {
                              // console.log("placeholder", placeholder);
                              if ( e.clientY < (layerInfo[placeholder.nodeId].full.top - 5) ) return;
                            }

                          }
                        }
                      }

                      if (placeholder) {
                        console.log(placeholder)
                        this.setState({
                          placeholder
                        })

                      }

                    }
                  }
                }}
              >
                <RenderTreeNode layer={tree} />
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
    //  padding-left: 10px;
   }
 }
`

Layers.contextType = BuilderContext;