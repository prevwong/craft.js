import React from "react";
import BuilderContext from "~packages/core/BuilderContext";
import { nodesToTree, getDeepChildrenNodes } from "~packages/core/utils";
import RenderTreeNode from "./RenderTreeNode";
import styled from "styled-components";
import { NodeId, CanvasNode, BuilderContextState } from "~types";
import LayerContext from "./context";
import { findPosition } from "./helper";

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


export default class Layers extends React.Component {
  layerInfo: any =  {}
  state = {
    dragging: false,
    placeholder: null
  }
  setLayerState(state, id: NodeId) {
      console.log("set dragging")
      this.setState({
          [state]: id
      })
  }

  getNearestTarget(e: React.MouseEvent) {
      const { layerInfo} = this;
      const {  active, nodes }: BuilderContextState  = this.context;
      const pos = { x: e.clientX, y: e.clientY };
      
      const deepChildren =  getDeepChildrenNodes(nodes, active.id);
      const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
        return nodeId && !deepChildren.includes(nodeId)
      });
      
      return nodesWithinBounds.filter((nodeId: NodeId) => {
        const {top, left, width, height } = layerInfo[nodeId];
        return (
          (pos.x >= left && pos.x <= left + width) &&
          (pos.y >= top && pos.y <= top + height)
        );
      });
    };

  render() {
      const { dragging, placeholder } = this.state;
      const { setLayerState, layerInfo } = this;
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
                          setLayerState: setLayerState.bind(this),
                          builder,
                          placeholder
                      }}>
                          <List 
                              onMouseMove={(e) => {
                                  if ( dragging ) {
                                        if ( active ) {
                                          const nearestTargets = this.getNearestTarget(e),
                                          nearestTargetId = nearestTargets.pop();
                                  
                                          if (nearestTargetId) {
                                              const targetNode = nodes[nearestTargetId],
                                              targetParent: CanvasNode = (targetNode as CanvasNode).nodes ? targetNode : nodes[targetNode.parent];
                                      
                                              const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
                                                  return {
                                                      id,
                                                      ...layerInfo[id]
                                                  }
                                              });

                                              const placeholder = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
                                              this.setState({
                                                placeholder: {
                                                  node: nodes[placeholder.parent.nodes[placeholder.index]],
                                                  where: placeholder.where
                                                }
                                              })
                                          }
                                      }
                                  }
                              }}
                              onMouseUp={(e) => {
                                  console.log("mouseup")
                                  if ( dragging ) this.setState({ dragging: null, placeholder: null })
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

Layers.contextType = BuilderContext;