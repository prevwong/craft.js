import React from "react";
import RenderNode from "../render/RenderNode";
import NodeElement from "../nodes/NodeElement";
import { createNode, mapChildrenToNodes } from "../utils";
import produce from "immer";
import { NodeId, Nodes, CanvasNode } from "~types";
import { NodeCanvasContext } from "./NodeCanvasContext";

const shortid = require("shortid");

export default class Canvas extends React.PureComponent<any> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props: CanvasNode, context: NodeCanvasContext) {
    super(props);
    const { node, pushChildCanvas, childCanvas, api } = context,
          { id } = props;

    let canvasId = `canvas-${shortid.generate()}`;
    if ( node.type === Canvas ) {
      canvasId = this.id = node.id;
    } else {
      if ( !id ) throw new Error("Root Canvas cannot ommit `id` prop");
      if ( childCanvas[id] ) canvasId = childCanvas[id];
    }
    
    if (!api.nodes[canvasId] || (api.nodes[canvasId] && !(api.nodes[canvasId] as CanvasNode).nodes)) {
      const { children } = this.props,
            childNodes = mapChildrenToNodes(children, canvasId);
      let rootNode: CanvasNode =  
              node.type === Canvas ? {...node} : 
              createNode(this.constructor as React.ElementType, this.props, canvasId, null);
      
      // makePropsReactive(childNodes, () => builder.setNodes());
      
      rootNode = produce(rootNode, draft => {
        if (node.type === Canvas) draft.parent = draft.closestParent = node.parent;
        else draft.closestParent = node.id;
  
        draft.nodes = childNodes.map(node => node.id);
      });
      
      api.methods.add([rootNode, ...childNodes]);
      if ( node.type !== Canvas )  {
        pushChildCanvas(id, canvasId);
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
      <NodeCanvasContext.Consumer>
        {({ node, childCanvas, api }: NodeCanvasContext) => {
          const canvasId = this.id ? this.id : childCanvas[this.props.id];
          if (!canvasId ) return false;
          this.id = canvasId;
          const { nodes } = api,
                canvas = nodes[canvasId] as CanvasNode;
          
          return (
            canvas && <NodeElement node={canvas}>
              <RenderNode
              is={canvas.props.is ? canvas.props.is : "div"}
              {...props}
            >
              <React.Fragment>
                {
                  canvas && canvas.nodes && canvas.nodes.map((nodeId: NodeId) => {
                    return (
                      <NodeElement key={nodeId} node={nodes[nodeId]}>
                        <RenderNode />
                      </NodeElement>
                    )
                  })
                }
              </React.Fragment>
            </RenderNode>
          </NodeElement>
           
          )
        }}
      </NodeCanvasContext.Consumer>
    )
  }
}

Canvas.contextType = NodeCanvasContext;
