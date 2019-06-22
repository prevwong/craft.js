import React from "react";
import { mapChildrenToNodes } from "../utils";
import NodeElement from "../nodes/NodeElement";
import { CraftAPIContext } from "../CraftAPIContext";
import Canvas from "../nodes/Canvas";
import RenderNode from "./RenderNode";

export default class Renderer extends React.Component<any> {
 
  constructor(props: any, context: CraftAPIContext) {
    super(props);
  
    let node = mapChildrenToNodes(<Canvas>{this.props.children}</Canvas>, null, "rootNode");
    context.manager.methods.add(node);
  }

  shouldComponentUpdate(){
    return false;
  }

  render() {
    console.log("gg")
    return (
      <CraftAPIContext.Consumer>
          {({manager: {nodes}}) => {
              return (
                nodes["rootNode"]  && 
                    <NodeElement node={nodes["rootNode"]}>
                        <RenderNode />
                    </NodeElement>
              )
          }}
      </CraftAPIContext.Consumer>
    )
  }
}

Renderer.contextType = CraftAPIContext;