import React from "react";
import { Node,  NodeId, BuilderContextState, PlaceholderInfo, BuilderState } from "~types";
import BuilderContext from "../BuilderContext";
import { mapChildrenToNodes } from "../utils";
import NodeElement from "../nodes/NodeElement";
import RenderNodeWithContext from "./RenderNodeWithContext";

export default class Renderer extends React.Component<any> {
 
  constructor(props: any, context: BuilderContextState) {
    super(props);
  
    let node = mapChildrenToNodes(
        <div id="root-node" style={{float:"left", width:"100%"}}>
            {this.props.children}
        </div>, null, "rootNode");

    context.setNodes((nodes) => {
        nodes["rootNode"] = node["rootNode"];
        console.log("set", nodes)
        return nodes;
    });
  }


  render() {
    (window as any).tree = this.state;
    return (
      <BuilderContext.Consumer>
          {({nodes}) => {
              console.log(nodes)
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