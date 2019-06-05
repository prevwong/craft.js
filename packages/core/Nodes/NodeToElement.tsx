import React from "react";
import ReactDOM from "react-dom";
import { Node } from "~types";
import NodeElement from "./NodeElement";
import { NodeInfo } from "~types/tree";
import { getDOMInfo } from "~src/utils";
import { BuilderContext } from "../Builder/context";

export default class NodeToElement extends React.PureComponent<any, any> {
  dom: HTMLElement = null;
  node: Node = null;
  info: NodeInfo = {};
  dragStartWrapper: EventListenerOrEventListenerObject = this.dragStart.bind(this);
  dragWatchWrapper: EventListenerOrEventListenerObject = this.dragWatch.bind(this);
  dragEndWrapper: EventListenerOrEventListenerObject = this.dragEnd.bind(this);
  dragStart(e: MouseEvent) {
    e.stopPropagation();
    if (e.which !== 1) return;
    const { id } = this.node;
    const { setActive } = this.context;
    // Active element, now we'll be able to edit its' props
    setActive(id);
    window.addEventListener("mousemove", this.dragWatchWrapper);
    window.addEventListener("mouseup", this.dragEndWrapper);
  }

  dragWatch(e: MouseEvent) {
    const { active, dragging, setDragging } = this.context;
    const { dom } = this.info;
    if (
      !(
        e.clientX >= dom.left &&
        e.clientX <= dom.right &&
        e.clientY >= dom.top &&
        e.clientY <= dom.bottom
      ) &&
      !dragging
    ) {
      // Element being dragged
      setDragging(active.id);
    }
  }

  dragEnd(e: MouseEvent) {
    const { active, dragging, setDragging } = this.context;
    setDragging(null);

    window.removeEventListener("mouseup", this.dragEndWrapper);
    window.removeEventListener("mousemove", this.dragWatchWrapper);
  }

  componentDidMount() {
    this.dom.addEventListener("mousedown", this.dragStartWrapper);
  }
  render() {
    const { nodeId } = this.props;
    return (
      <BuilderContext.Consumer>
        {({ nodes }) => {
          const node = nodes[nodeId];
          const { id, props, component: Comp } = this.node = node as Node;
          return (
            <NodeElement node={node}>
              <Comp
                {...props}
                ref={(ref) => {
                  if (ref) {
                    this.dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                    this.info = {
                      dom: getDOMInfo(this.dom)
                    };
                    node.info = this.info;
                  }

                }}
              />
            </NodeElement>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}


NodeToElement.contextType = BuilderContext;