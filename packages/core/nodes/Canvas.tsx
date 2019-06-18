import React from "react";
import { NodeId, CanvasNode, Nodes, NodeContextState, NodeCanvasContextState } from "~types";
import RenderNode from "../render/RenderNode";
import NodeElement from "../nodes/NodeElement";
import NodeCanvasContext from "../nodes/NodeCanvasContext";
import { createNode, mapChildrenToNodes } from "../utils";
import RenderNodeWithContext from "../render/RenderNodeWithContext";
const shortid = require("shortid");

export default class Canvas extends React.PureComponent<any> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props: CanvasNode, context: NodeCanvasContextState) {
    super(props);
    const { node, pushChildCanvas, childCanvas, builder } = context,
          { id } = props;

    let canvasId = `canvas-${shortid.generate()}`;
    if ( node.type === Canvas ) {
      canvasId = this.id = node.id;
    } else {
      if ( !id ) throw new Error("Root Canvas cannot ommit `id` prop");
      if ( childCanvas[id] ) canvasId = childCanvas[id];
    }
    
    if (!builder.nodes[canvasId] || (builder.nodes[canvasId] && !(builder.nodes[canvasId] as CanvasNode).nodes)) {
      const { children } = this.props,
            childNodes = mapChildrenToNodes(children, canvasId),
            rootNode: CanvasNode =  
              node.type === Canvas ? {...node} : 
              createNode(this.constructor as React.ElementType, this.props, canvasId, null);
      
      // makePropsReactive(childNodes, () => builder.setNodes());
      
      if (node.type === Canvas) rootNode.parent = node.parent;
      else rootNode.parentNode = node.id;
      
      rootNode.nodes = Object.keys(childNodes);

      builder.setNodes((prevNodes: Nodes) => {
        return {
          ...prevNodes,
          [rootNode.id]: rootNode,
          ...childNodes
        }
      })
    }

    if ( node.type !== Canvas )  pushChildCanvas(id, canvasId);
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;
    // console.log("canvas", props)
    return (
      <NodeCanvasContext.Consumer>
        {({ node, childCanvas, builder }: NodeCanvasContextState) => {
          const canvasId = this.id ? this.id : childCanvas[this.props.id];
          if (!canvasId ) return false;
          this.id = canvasId;
          const { nodes } = builder,
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
                        <RenderNodeWithContext />
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
