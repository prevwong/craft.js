import React from "react";
import produce from "immer";
import { CanvasNode, Nodes, NodeId, Node } from "~types";
import { NodeManagerContext } from "./nodes/NodeManagerContext";
import EventManager from "./events/EventManager";
import { createAPIContext, CraftAPIContext } from "./CraftAPIContext";
import { EventContext } from "./events/EventContext";

interface BuilderState {
  nodes: Nodes
}

export default class Root extends React.PureComponent {
  render() {
    console.log("root-render");
    return (
      <NodeManagerContext.Consumer>
        {(manager) => {
          return (
            <EventContext.Consumer>
              {(events) => {
                return (
                  <CraftAPIContext.Provider value={{
                    manager,
                    events
                  }}>
                    {this.props.children}
                  </CraftAPIContext.Provider>
                )
              }}
            </EventContext.Consumer>
          )
        }}
      </NodeManagerContext.Consumer>
    )
  }
}