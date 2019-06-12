import React, { Component } from "react";
import { DropAction, CoreState, BuilderContextState } from "~types";
import { placeBestPosition } from "./helper";
import BuilderContext from "../BuilderContext";

class DragDropManager extends Component {
  lastPos: DropAction;
  onDrag: EventListenerOrEventListenerObject;
  constructor(props: any) {
    super(props);
    this.onDrag = this.drag.bind(this);
  }

  drag(e: MouseEvent) {
    e.stopPropagation();
    const { dragging, nodes }: BuilderContextState = this.context;
    // console.log("DRAGTREE", JSON.stringify(Object.keys(tree.indexes)));
    if (dragging) {
      // console.log(nodes)
      const placeholder = placeBestPosition(nodes, dragging, e);

      //   if (placeholder) {
      //     setPlaceholder(placeholder);
      //   }
    }
  }
  render() {
    return (
      <BuilderContext.Consumer>
        {({ dragging, active }: BuilderContextState) => {
          if (dragging) window.addEventListener("mousemove", this.onDrag);
          else window.removeEventListener("mousemove", this.onDrag);
          return (
            <React.Fragment>

              {this.props.children}
            </React.Fragment>
          );
        }}
      </BuilderContext.Consumer>
    );
  }
}

DragDropManager.contextType = BuilderContext;

export default DragDropManager;
