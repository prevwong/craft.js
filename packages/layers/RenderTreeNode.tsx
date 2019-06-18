import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import { List } from ".";
import LayerContext from "./context";
import { getDOMInfo } from "./utils/dom";
import { LayerContextState } from "./types";

export default class RenderTreeNode extends React.Component<any> {
  ref = React.createRef();

  render() {
    const { node } = this.props;
    const { children } = node;
    const layer = this.props.layer ? this.props.layer : 0;

    return (
      <LayerContext.Consumer>
        {({ layerInfo, setDragging, placeholder, builder }: LayerContextState) => {
          const { setNodeState } = builder;
          return (
            <LayerNode
              ref={(dom) => {
                if (dom) {
                  layerInfo[node.id].full = getDOMInfo(dom);
                }
              }}
              
            >
              <LayerNodeMovementIndicator
                style={{paddingLeft: `${(layer) * 10}px`}}
                placeholderBefore={placeholder && placeholder.nodeId === node.id && placeholder.where === "before"}
                placeholderAfter={placeholder && placeholder.nodeId === node.id && placeholder.where === "after"}
                />
              <LayerNodeTitle
                style={{ paddingLeft: `${(layer) * 10}px` }}
                placeholderInside={placeholder && placeholder.nodeId === node.id && placeholder.where === "inside"}
                onMouseDown={(e) => {
                  if ( !node.parent ) return;
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setNodeState("active", node.id);
                  setDragging(node.id);
                  return false;
                }}
                ref={(dom) => {
                  if (dom) {
                    layerInfo[node.id] = getDOMInfo(dom);
                  }
                }}
              >
                <div>
                  {node.id}
                </div>
              </LayerNodeTitle>
              {
                (children) ? (
                  <List>
                    {
                      Object.keys(children).map((childId) => {
                        return <RenderTreeNode key={childId} node={children[childId]} layer={layer + 1} />
                      })
                    }
                  </List>
                ) : null
              }
            </LayerNode>
          )
        }}
      </LayerContext.Consumer>
    )
  }
}



const LayerNode = styled.li`
  position:relative;
  height:100%;
  font-weight: lighter;
  text-align: left;
  position: relative;
  font-size: .75rem;
  float:left;
  width:100%;
  padding-bottom:1px;
`

const LayerNodeTitle = styled.div`
  font-weight: lighter;
  letter-spacing: 1px;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding:0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  outline: ${props => props.placeholderInside ? "1px solid #000" : "none"};
`

const LayerNodeMovementIndicator = styled.div`
  position:absolute;
  height:100%;
  width:100%;

  &:after {
    content: " ";
    display:block; 
    left:0;
    width:100%;
    height:2px;
    display:block;
    background:#000;
    position:relative;
    display: ${props => (props.placeholderBefore || props.placeholderAfter) ? "block" : "none" };
    top: ${props => (props.placeholderBefore) ? 0 : "auto" };
    bottom: ${props => (props.placeholderAfter) ? "-100%" : "auto" };
  }
`

RenderTreeNode.contextType = LayerContext;