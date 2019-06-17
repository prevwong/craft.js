import React from "react";
import styled from "styled-components";
import { List } from ".";
import BuilderContext from "~packages/core/BuilderContext";

export default class RenderTreeNode extends React.Component<any> {
    componentDidMount() {
        
    }
    render() {
        const { node } = this.props;
        const {id, canvasName, type, props, children} = node;
        return (
            <BuilderContext.Consumer>
                {({setNodeState, nodeState}) => {
                    return (
                        <li>
                            <a onMouseOver={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                setNodeState("hover", node.id)   
                                return false; 
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                setNodeState("active", node.id)   
                                return false; 
                            }}
                            >
                               x {typeof type === "function" ? type.name : type} {props.id ? props.id : null}
                            </a>
                            {
                                children && Object.keys(children).length && (
                                    <List child>
                                        {
                                            Object.keys(children).map((childId) => {
                                                return <RenderTreeNode key={childId} node={children[childId]} />
                                            })
                                        }
                                    </List>
                                )
                            }
                        </li>
                    )
                }}
            </BuilderContext.Consumer>
        )
    }
}