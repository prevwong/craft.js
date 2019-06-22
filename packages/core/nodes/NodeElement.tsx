import { BuilderContextState, NodeElementProps, NodeId, Nodes } from "~types";
import React from "react";
import {NodeContext} from "./NodeContext";
import { NodeManagerContext } from "./NodeManagerContext";
import { CraftAPIContext } from "../CraftAPIContext";
import { NodeCanvasContext } from "./NodeCanvasContext";

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
    console.log("node-re")
    return (
      <NodeManagerContext.Consumer>
        {({methods: {setNodes}}) => {
          return (
            <CraftAPIContext.Consumer>
            {(api: CraftAPIContext) => {
              const {events, manager:{nodes}} = api;
              // console.log(events, node)
              const nodeProvider = {
                node,
                events: {
                  active: (events.active && events.active.node.id === node.id) ? events.active : null,
                  hover: (events.hover && events.hover.node.id === node.id) ? events.hover : null,
                  dragging: (events.dragging && events.dragging.node.id === node.id) ? events.dragging : null,
                },
                api
              }
              
              return (
                <NodeContext.Provider value={nodeProvider}>
                  <NodeCanvasContext.Provider value={{
                    ...nodeProvider,
                    pushChildCanvas: (name: string, canvasId: NodeId) => {
                      setNodes((prevNodes: Nodes) => {
                        if (!prevNodes[node.id].childCanvas ) prevNodes[node.id].childCanvas = {};
                        prevNodes[node.id].childCanvas[name] = canvasId;
                      })
                    },
                    childCanvas: nodes[node.id].childCanvas ? nodes[node.id].childCanvas : {}
                  }}> 
                    {
                      this.props.children
                    }
                  </NodeCanvasContext.Provider>
                </NodeContext.Provider>
              )
            }}
          </CraftAPIContext.Consumer>
          )
        }}
      </NodeManagerContext.Consumer>
    )
  }
}

