import React from "react";
import { NodeContext } from "~packages/core/nodes/NodeContext";
import { EventContext } from "~packages/core/events/EventContext";

export default class DragHandler extends React.Component<any> {
    render() {
      const {is: Comp} = this.props;
      return (
        <NodeContext.Consumer>
          {({node}) => {
            return (
              node.parent && 
                <EventContext.Consumer>
                  {({methods: {setNodeEvent}}) => {
                    return (
                      <Comp onMouseDown={() => setNodeEvent("dragging", node.id)}>
                        {this.props.children}
                      </Comp>
                    )
                  }}
                </EventContext.Consumer>
            )
          }}
        </NodeContext.Consumer>
        
      )
    }
  }
  DragHandler.contextType = NodeContext;