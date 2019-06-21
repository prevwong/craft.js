import { BuilderContextState, NodeElementProps, NodeId, Nodes, CraftAPIContext } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import BuilderContext from "../BuilderContext";
import NodeCanvasContext from "./NodeCanvasContext";
import { CraftAPI } from "../Builder";

export default class NodeElement extends React.Component<NodeElementProps> {
  loopInfo = {
    index: 0
  }
  componentDidUpdate() {
    this.loopInfo.index = 0;
  }
  constructor(props: NodeElementProps) {
    super(props);
  }
  render() {
    const { node } = this.props;
    return (
      <BuilderContext.Consumer>
        {({setImmer}) => {
          return (
            <CraftAPI.Consumer>
            {(builder: CraftAPIContext) => {
              const nodeProvider = {
                node,
                nodeState: {
                  active: (builder.active && builder.active.node.id === node.id) ? builder.active : false,
                  hover: (builder.hover && builder.hover.node.id === node.id) ? builder.hover : false,
                  dragging: (builder.dragging && builder.dragging.node.id === node.id) ? builder.dragging : false,
                },
                builder
              }
              return (
                <NodeContext.Provider value={nodeProvider}>
                  <NodeCanvasContext.Provider value={{
                    ...nodeProvider,
                    pushChildCanvas: (name: string, canvasId: NodeId) => {
                      setImmer((prevNodes: Nodes) => {
                        if (!prevNodes[node.id].childCanvas ) prevNodes[node.id].childCanvas = {};
                        prevNodes[node.id].childCanvas[name] = canvasId;
                      })
                    },
                    childCanvas: builder.nodes[node.id].childCanvas ? builder.nodes[node.id].childCanvas : {}
                  }}> 
                    {
                      this.props.children
                    }
                  </NodeCanvasContext.Provider>
                </NodeContext.Provider>
              )
            }}
          </CraftAPI.Consumer>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}

