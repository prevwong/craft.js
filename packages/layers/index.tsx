import React from "react";
import BuilderContext from "~packages/core/BuilderContext";
import { nodesToTree } from "~packages/core/utils";
import RenderTreeNode from "./RenderTreeNode";
import styled from "styled-components";

export const List = styled.ul`
 float:left;
 width:100%;
 margin: 0 0 0 ${props => props.child === true ? "5px" : "0"};
 padding:0;
`

export default class Layers extends React.Component {
    render() {
        return (
            <List>
                <BuilderContext.Consumer>
                    {({nodes}) => {
                        const tree = nodesToTree(nodes);
                        return tree && (
                            <RenderTreeNode node={tree} />
                        )
                    }}
                </BuilderContext.Consumer>
            </List>
        )
    }
}