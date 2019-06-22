import React from "react";
import { mapChildrenToNodes } from "../utils";
import NodeElement from "../nodes/NodeElement";
import { CraftAPIContext } from "../CraftAPIContext";
import Canvas from "../nodes/Canvas";
import RenderNode from "./RenderNode";

export default class Renderer extends React.PureComponent<any> {
 
  constructor(props: any, context: CraftAPIContext) {
    super(props);
  
    let node = mapChildrenToNodes(<Canvas>{this.props.children}</Canvas>, null, "rootNode");
    context.methods.add(node);
  }


  render() {
    return (
      <CraftAPIContext.Consumer>
          {({nodes}) => {
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