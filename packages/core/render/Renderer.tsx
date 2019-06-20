import React from "react";
import { Node,  NodeId, BuilderContextState, PlaceholderInfo, BuilderState, Nodes } from "~types";
import BuilderContext from "../BuilderContext";
import { mapChildrenToNodes } from "../utils";
import NodeElement from "../nodes/NodeElement";
import RenderNodeWithContext from "./RenderNodeWithContext";
import { Canvas } from "../nodes";

export default class Renderer extends React.Component<any> {
 
  constructor(props: any, context: BuilderContextState) {
    super(props);
  
    let node = mapChildrenToNodes(<Canvas>{this.props.children}</Canvas>, null, "rootNode");

    window.n = node;
    // console.log("n", node);
    context.setImmer((nodes: Nodes) => {
      nodes["rootNode"] = node["rootNode"];
    });
  }


  render() {
    return (
      <BuilderContext.Consumer>
          {({nodes}) => {
              return (
                nodes["rootNode"]  && 
                    <NodeElement node={nodes["rootNode"]}>
                        <RenderNodeWithContext />
                    </NodeElement>
              )
          }}
      </BuilderContext.Consumer>
    )
  }
}

Renderer.contextType = BuilderContext;