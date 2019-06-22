import { BuilderContextState, NodeElementProps, NodeId, Nodes } from "~types";
import React from "react";
import { NodeContext } from "./NodeContext";
import { NodeManagerContext } from "./NodeManagerContext";
import { CraftAPIContext } from "../CraftAPIContext";
import { NodeCanvasContext } from "./NodeCanvasContext";
import RenderNode from "../render/RenderNode";

export default class NodeElement extends React.PureComponent<NodeElementProps> {
  state = {

  }
  constructor(props) {
    super(props);
    this.state = {
      nodeId: props.nodeId
    }
  }
  render() {
    console.log("node element", this.props.is)
    return (
      <NodeContext.Provider value={this.state}>
        <RenderNode {...this.props} />
        <NodeManagerContext.Consumer>
          {({nodes}) => {
            const node = nodes[this.state.nodeId];
            
            return (
              <React.Fragment>
                {
                  node && node.nodes && node.nodes.map((nodeId: NodeId) => {
                    return (
                      <NodeElement key={nodeId} nodeId={nodeId} />
                    )
                  })
                }
              </React.Fragment>
            )
          }}
        </NodeManagerContext.Consumer>
      </NodeContext.Provider>
    )
  }
}

