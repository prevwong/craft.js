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
            <LayerNode>
              <LayerNodeTitle
                ref={(dom) => {
                  if (dom) {
                    layerInfo[node.id] = getDOMInfo(dom);
                  }
                }}
                style={{ paddingLeft: `${(layer + 1) * 10}px` }}
                placeholderBefore={placeholder && placeholder.nodeId === node.id && placeholder.where === "before"}
                placeholderAfter={placeholder && placeholder.nodeId === node.id && placeholder.where === "after"}
                placeholderInside={placeholder && placeholder.nodeId === node.id && placeholder.where === "inside"}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setNodeState("active", node.id);
                  setDragging("dragging", node.id);
                  return false;
                }}
              >
                {node.id}
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
`

const LayerNodeTitle = styled.div<{
  placeholderBefore: Boolean,
  placeholderAfter: Boolean,
  placeholderInside: Boolean
}>`
  font-weight: lighter;
  letter-spacing: 1px;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding: 3px 10px 5px 5px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  outline: ${props => props.placeholderInside ? "1px solid #000" : "none"};

  &:after, &:before {
    content: " ";
    float:left;
    width:100%;
    height:2px;
    width:100%;
    background:#000;
    position:absolute;
    left:0;
  }

  &:after {
    bottom:0;
    display: ${props => props.placeholderAfter ? "block" : "none"} 
  }

  &:before {
    top:0;
    display: ${props => props.placeholderBefore ? "block" : "none"} 
  }
`

RenderTreeNode.contextType = LayerContext;