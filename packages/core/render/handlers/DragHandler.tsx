import React, { SyntheticEvent } from "react";
import { NodeContext } from "~packages/core/nodes";
import { CanvasNode, Nodes, BuilderContextState } from "~types";
import { moveNode } from "~packages/core/utils";
import { DNDContext } from "~packages/core/dnd";

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