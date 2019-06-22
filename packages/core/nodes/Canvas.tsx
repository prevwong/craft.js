import React from "react";
import RenderNode from "../render/RenderNode";
import NodeElement from "../nodes/NodeElement";
import { createNode, mapChildrenToNodes } from "../utils";
import produce from "immer";
import { NodeId, Nodes, CanvasNode } from "~types";
import { NodeCanvasContext } from "./NodeCanvasContext";
import { NodeContext } from "./NodeContext";
import { NodeManagerContext } from "./NodeManagerContext";

const shortid = require("shortid");

export default class Canvas extends React.PureComponent<any> {
  render() {
    return (
      <NodeContext.Consumer>
        {({ nodeId }) => {
          return (
            <CanvasR nodeId={nodeId}  {...this.props} />
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

class CanvasR extends React.PureComponent<any> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props: CanvasNode, context: NodeCanvasContext) {
    super(props);
    const { nodes, methods } = context,
      { id, nodeId } = props;

    const node = nodes[nodeId];
    console.log("canvas", props)
    let canvasId = `canvas-${shortid.generate()}`;
    if (node.type === Canvas) {
      canvasId = this.id = node.id;
    } else {
      if (!id) throw new Error("Root Canvas cannot ommit `id` prop");
      if (node.childCanvas && node.childCanvas[id]) canvasId = node.childCanvas[id];
    }

    if (!nodes[canvasId] || (nodes[canvasId] && !(nodes[canvasId] as CanvasNode).nodes)) {
      const { children } = this.props,
        childNodes = mapChildrenToNodes(children, canvasId);
      let rootNode: CanvasNode =
        node.type === Canvas ? { ...node } :
          createNode(this.constructor as React.ElementType, this.props, canvasId, null);

      // makePropsReactive(childNodes, () => builder.setNodes());

      rootNode = produce(rootNode, draft => {
        if (node.type === Canvas) draft.parent = draft.closestParent = node.parent;
        else draft.closestParent = node.id;

        draft.nodes = childNodes.map(node => node.id);
      });

      methods.add([rootNode, ...childNodes]);
      if (node.type !== Canvas) {
        methods.setNodes((prevNodes: Nodes) => {
          if (!prevNodes[node.id].childCanvas) prevNodes[node.id].childCanvas = {};
          prevNodes[node.id].childCanvas[id] = canvasId;
        })
      }
      // builder.setImmer((prevNodes: Nodes) => {
      //   prevNodes[rootNode.id] = rootNode;
      //   Object.keys(childNodes).forEach(id => {
      //     prevNodes[id] = childNodes[id];
      //   });

      //   if ( node.type !== Canvas )  {
      //     if (!prevNodes[node.id].childCanvas ) prevNodes[node.id].childCanvas = {};
      //     prevNodes[node.id].childCanvas[id] = rootNode.id;
      //   }
      // })
    }
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;

    return (
      <NodeManagerContext.Consumer>
        {({ nodes }) => {
          return (
            <NodeContext.Consumer>
              {({ nodeId }: NodeCanvasContext) => {
                const node = nodes[nodeId];
                const canvasId = this.id ? this.id : node.childCanvas && node.childCanvas[this.props.id];
                if (!canvasId) return false;
                this.id = canvasId;
                const canvas = nodes[canvasId] as CanvasNode;

                return (
                  canvas && <NodeElement is={canvas.props.is ? canvas.props.is : "div"} nodeId={canvasId} />
                )
              }}
            </NodeContext.Consumer>
          )
        }}
      </NodeManagerContext.Consumer>
    )
  }
}

CanvasR.contextType = NodeManagerContext;
