import React, { Component } from "react";
import RenderComp, { ComponentContext } from "./RenderComp";
import TestRender from "./TestRender";
import Editor from "./RenderEditor";
import { NodeContext } from "../nodes/NodeContext";
import EventContext from "../events/EventContext";
import Canvas from "../nodes/Canvas";

export default class RenderNode extends React.PureComponent<any> {
  render() {
    const { is, onReady, ...passProps } = this.props;
   
    return (
        <NodeContext.Consumer>
          {({node, events, api}: NodeContext) => {
            const { type, props} = node;
            const Comp = is ? is : type
            return (
              <EventContext.Consumer>
                {({hover, setNodeEvent}) => {
                  
                  return (
                    <ComponentContext.Provider value={{
                      Component: Comp,
                      props: {
                        ...props,
                        ...passProps,
                        onMouseOver: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if ( !hover ||( hover && hover.node.id !== node.id) ) {
                            setNodeEvent("hover", node.id);
                          }
                        }
                      }
                    }}>
                      {
                        Comp === Canvas ? <Canvas {...props} /> : 
                        <TestRender  
                          node={node}
                          Component={RenderComp} 
                          events={events}
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
  }
}

RenderNode.contextType = NodeContext;