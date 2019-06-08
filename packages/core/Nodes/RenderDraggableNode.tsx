import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, RegisteredNode } from "~types/tree";
import { BuilderContext } from "../Builder/context";
import RenderRegisteredNode from "./RenderRegisteredNode";

export default class RenderDraggableNode extends React.Component<any> {
  dom: HTMLElement = null;
  node: RegisteredNode = null;
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
          const { id, props, type } = this.node = node as RegisteredNode;
          return (
            <NodeElement node={node}>
              <RenderRegisteredNode
                {...props}
                is={type}
                node={node}
                onReady={(dom: HTMLElement, info: NodeInfo) => {
                  this.dom = dom;
                  this.info = info;
                }}
              />
            </NodeElement>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}


RenderDraggableNode.contextType = BuilderContext;