import React, { Component } from "react";
import RenderComp, { ComponentContext } from "./RenderComp";
import TestRender from "./TestRender";
import Editor from "./RenderEditor";
import { NodeContext } from "../nodes/NodeContext";
import Canvas from "../nodes/Canvas";
import { EventContext } from "../events/EventContext";
import { NodeManagerContext } from "../nodes/NodeManagerContext";

export default class RenderNode extends React.Component<any> {

  render() {
    const { is, onReady, ...passProps } = this.props;
   
    return (
      <NodeManagerContext.Consumer>
        {({ nodes }) => {
          return (
            <NodeContext.Consumer>
              {({ nodeId }: NodeContext) => {
                
                const node = nodes[nodeId];
                const { type, props } = node;
                const Comp = is ? is : type
                console.log("re-render node comp", is, Comp, Comp === Canvas, nodeId)
                return (
                  <EventContext.Consumer>
                    {({ hover, methods: { setNodeEvent } }) => {
                      return (
                        <ComponentContext.Provider value={{
                          Component: Comp,
                          props: {
                            ...props,
                            ...passProps,
                           
                          }
                        }}>
                          {
                            (Comp === Canvas) ? 
                              <Canvas {...props} /> :
                              <TestRender
                                node={node}
                                Component={RenderComp}
                                Editor={Editor}
                              />
                          }
                        </ComponentContext.Provider>
                      )
                    }}
                  </EventContext.Consumer>
                )
              }}
            </NodeContext.Consumer>
          )
        }}
      </NodeManagerContext.Consumer>
    )
  }
}

RenderNode.contextType = NodeContext;