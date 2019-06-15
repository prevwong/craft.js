import { BuilderContextState, NodeElementState, NodeElementProps, NodeId } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import BuilderContext from "../BuilderContext";
import NodeCanvasContext from "./NodeCanvasContext";

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
  constructor(props: NodeElementProps) {
    super(props);
    if (this.props.node && this.props.node.childCanvas) this.state.childCanvas = this.props.node.childCanvas;
  }
  render() {
    const { node } = this.props;
    const { childCanvas } = this.state;
    return (
      <BuilderContext.Consumer>
        {(builder: BuilderContextState) => {
          const nodeProvider = {
            node,
            nodeState: {
              active: builder.active && builder.active.id === node.id,
              hover: builder.hover && builder.hover.id === node.id,
              dragging: builder.dragging && builder.dragging.id === node.id
            },
            builder
          }
          return (
            <NodeContext.Provider value={nodeProvider}>
              <NodeCanvasContext.Provider value={{
                 ...nodeProvider,
                 childCanvas,
                 pushChildCanvas: (canvasId: string, canvasNodeId: NodeId) => {
                  if (!node.childCanvas) node.childCanvas = {};
                  this.setState((state: NodeElementState) => {
                    state.childCanvas[canvasId] = node.childCanvas[canvasId] = canvasNodeId;
                    return state;
                  });
                }
              }}> 
                {
                  this.props.children
                }
              </NodeCanvasContext.Provider>
            </NodeContext.Provider>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}

