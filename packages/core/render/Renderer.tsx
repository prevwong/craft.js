import React from "react";
import { Node,  NodeId, BuilderContextState, PlaceholderInfo, BuilderState, Nodes } from "~types";
import BuilderContext from "../BuilderContext";
import { mapChildrenToNodes } from "../utils";
import NodeElement from "../nodes/NodeElement";
import RenderNodeWithContext from "./RenderNodeWithContext";
import { Canvas } from "../nodes";

export default class Renderer extends React.PureComponent<any> {
 
  constructor(props: any, context: BuilderContextState) {
    super(props);
  
    let node = mapChildrenToNodes(<Canvas>{this.props.children}</Canvas>, null, "rootNode");


    context.add([...node]);
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