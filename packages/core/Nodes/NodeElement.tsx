import { BuilderContextState, NodeElementState, NodeElementProps, NodeId } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import BuilderContext from "../Builder/BuilderContext";

export default class NodeElement extends React.Component<NodeElementProps> {
  loopInfo = {
    index: 0
  }
  state: NodeElementState = {
    childCanvas: {},
  }
  componentDidUpdate() {
    this.loopInfo.index = 0;
  }
  componentWillMount() {
    if (this.props.node && this.props.node.childCanvas) this.state.childCanvas = this.props.node.childCanvas;
  }
  render() {
    const { node } = this.props;
    const { childCanvas } = this.state;
    return (
      <BuilderContext.Consumer>
        {(builder: BuilderContextState) => {
          return (
            <NodeContext.Provider value={{
              node,
              childCanvas,
              pushChildCanvas: (canvasId: string, canvasNodeId: NodeId) => {
                // if ( node.type !== Canvas ) {
                  if (!node.childCanvas) node.childCanvas = {};
                this.state.childCanvas[canvasId] = node.childCanvas[canvasId] = canvasNodeId;
                // }
                // console.log("node", node.type == Canvas)
                
                this.setState({
                  ...this.state,
                });

              },
              builder
            }}>
              {
                this.props.children
              }
            </NodeContext.Provider>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}

