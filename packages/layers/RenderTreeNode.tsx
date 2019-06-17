import React, { SyntheticEvent } from "react";
import styled from "styled-components";
import { List } from ".";
import BuilderContext from "~packages/core/BuilderContext";
import { NodeContext, Canvas } from "~packages/core";
import cx from "classnames";
import { addNode, getDOMInfo, getDeepChildrenNodes } from "~packages/core/utils";
import { findPosition } from "~packages/core/dnd/helper";
import { CanvasNode, NodeId, BuilderContextState } from "~types";
import LayerContext from "./context";
import Placeholder from "~packages/core/dnd/Placeholder";

const LayerNode = styled.li`
position:relative;
height:100%;
font-weight: lighter;
text-align: left;
position: relative;
font-size: .75rem;
`

const LayerNodeTitle = styled.div`
  font-weight: lighter;
  letter-spacing: 1px;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding: 3px 10px 5px 5px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.25);
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
    display: ${props => props.placeholder.after ? "block" : "none" } 
  }

  &:before {
    top:0;
    display: ${props => props.placeholder.before ? "block" : "none" } 
  }
`

export default class RenderTreeNode extends React.Component<any> {
    ref= React.createRef();
    mousedown = false
    componentDidMount() {
        
    }
  

    render() {
        const { node } = this.props;
        const {id, canvasName, type, props, children} = node;
        const layer = this.props.layer ? this.props.layer : 0;

        return (
            <LayerContext.Consumer>
                {({layerInfo, setLayerState, placeholder, builder}) => {
                    const {setNodeState} = builder;
                    return (
                        <LayerNode ref={(dom) => {
                            if ( dom ) {
                                layerInfo[node.id] = getDOMInfo(dom);
                            }
                        }} child>
                            <LayerNodeTitle
                            style={{paddingLeft: `${(layer+1)*10}px`}}
                            placeholder={{
                              before: placeholder &&  placeholder.node.id === node.id && placeholder.where === "before",
                              after:  placeholder && placeholder.node.id === node.id && placeholder.where === "after"

                            }}
                            onMouseOver={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                               
                                return false; 
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                setNodeState("active", node.id);
                                setLayerState("dragging", node.id); 
                                this.mousedown = true;
                                return false; 
                            }}
                            onMouseUp={(e) => {
                                this.mousedown = false;
                            }}
                            >
                               {node.id}
                            </LayerNodeTitle>
                            {
                                children && Object.keys(children).length && (
                                    <List child>
                                        {
                                            Object.keys(children).map((childId) => {
                                                return <RenderTreeNode key={childId} node={children[childId]} layer={layer+1} />
                                            })
                                        }
                                    </List>
                                )
                            }
                        </LayerNode>
                    )
                }}
            </LayerContext.Consumer>
        )
    }
}

RenderTreeNode.contextType = LayerContext;