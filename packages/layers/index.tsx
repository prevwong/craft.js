import React from "react";
import BuilderContext from "~packages/core/BuilderContext";
import { nodesToTree } from "~packages/core/utils";
import RenderTreeNode from "./RenderTreeNode";

export default class Layers extends React.Component {
    render() {
        return (
            <ul>
            <BuilderContext.Consumer>
                {({nodes}) => {
                    const tree = nodesToTree(nodes);
                    return (
                        <RenderTreeNode node={tree} />
                    )
                }}
            </BuilderContext.Consumer>
            </ul>
        )
    }
}