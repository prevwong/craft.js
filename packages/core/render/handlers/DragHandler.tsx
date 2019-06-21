import React from "react";
import { NodeContext } from "~packages/core/nodes";
import DNDContext from "~packages/core/dnd/DNDContext";

export default class DragHandler extends React.Component {
    render() {
      const {is: Comp} = this.props;
      return (
        <NodeContext.Consumer>
          {({node}) => {
            return (
              node.parent && 
                <DNDContext.Consumer>
                  {({setDragging}) => {
                    return (
                      <Comp onMouseDown={() => setDragging(node.id)}>
                        {this.props.children}
                      </Comp>
                    )
                  }}
                </DNDContext.Consumer>
            )
          }}
        </NodeContext.Consumer>
        
      )
    }
  }
  DragHandler.contextType = NodeContext;