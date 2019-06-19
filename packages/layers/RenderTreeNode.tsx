import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import { List } from ".";
import LayerContext from "./context";
import { getDOMInfo } from "./utils/dom";
import { LayerContextState } from "./types";

export default class RenderTreeNode extends React.Component<any> {
  state = {
    showChildren: false
  }
  ref = React.createRef();

  render() {
    const {showChildren} = this.state;
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
                  // console.log("node", node.id);
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
                  
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setNodeState("active", node.id);
                  if ( !node.parent ) return;
                  setDragging(node.id);
                  return false;
                }}
                ref={(dom) => {
                  if (dom) {
                    layerInfo[node.id] = getDOMInfo(dom);
                  }
                }}
              >
                <div className="nodename">{node.id}</div>
                {
                  (children && Object.keys(children).length) ? <a onMouseDown={(e) => {
                    console.log("clicked")
                    e.stopPropagation();
                    this.setState({ showChildren: !showChildren })
                  }}>Toggle</a> : null
                }
              </LayerNodeTitle>
              {
                (children && showChildren) ? (
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

const LayerNodeTitle = styled.div<{
  placeholderInside: Boolean
}>`
  font-weight: lighter;
  letter-spacing: 1px;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  outline: ${props => props.placeholderInside ? "1px solid #000" : "none"};
  > .nodename {
    flex:1; 
  }
`

const LayerNodeMovementIndicator = styled.div<{
  placeholderBefore: Boolean
  placeholderAfter: Boolean
}>`
  position:absolute;
  height:100%;
  width:100%;
  &:after {
    content: " ";
    display:block; 
    left:0;
    width:100%;
    height:1px;
    display:block;
    background:#000;
    position:relative;
    margin-top: -1px;
    display: ${props => (props.placeholderBefore || props.placeholderAfter) ? "block" : "none" };
    top: ${props => (props.placeholderBefore) ? 0 : "auto" };
    bottom: ${props => (props.placeholderAfter) ? "-100%" : "auto" };
  }
`

RenderTreeNode.contextType = LayerContext;