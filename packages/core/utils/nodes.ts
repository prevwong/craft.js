import React, { ReactNode } from "react";
import { NodeId, Node, Nodes, CanvasNode, TreeNode } from "~types";
import { defineReactiveProperty } from ".";
import Canvas from "../nodes/Canvas";
const shortid = require("shortid");

export const createNode = (component: React.ElementType, props: React.Props<any>, id: NodeId, parent?: NodeId): Node => {
  let node: Node = {
    type: component as React.ElementType,
    props
  };

  node["id"] = id;
  node["parent"] = parent;
  return node;
};


export const mapChildrenToNodes = (children: ReactNode, parent?: NodeId, hardId?: string): Nodes => {
  return React.Children.toArray(children).reduce(
    (result: Nodes, child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = React.createElement(TextNode, {text: child}, null);
      }
      let { type, props } = child;

      if ( ["string", "function"].includes(typeof(type))) { 
        const prefix = (type as Function) === Canvas ? "canvas" : "node";
        const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

        let node = createNode(type as React.ElementType, props, id, parent);
        result[node.id] = node;
        return result;
      } else {
        throw new Error("Invalid <Canvas> child provided. Expected simple JSX element or React Component.");
      }
    },
    {}
  ) as Nodes;
};



export const makePropsReactive = (nodes: Nodes, cb: Function) => {
  Object.keys(nodes).forEach(id => {
    const node = nodes[id];
    let {props} = node;
    const reactiveProps = Object.keys(props).reduce((result: any, key) => {
      const value = (props as any)[key];
      if ( key !== "children" ) {
        defineReactiveProperty(result, key, value, () => {
          cb()
        });
      } else {
        result[key] = value
      }

      return result;
    }, {});
    node.props = reactiveProps;
  })
}

export class TextNode extends React.Component<{text: string}> {
  render() {
    const {text} = this.props;
    return React.createElement('span', null, text);
  }
}
  
export const nodesToTree = (nodes: Nodes, cur="rootNode", canvasName?: string): TreeNode => {
  let tree: any = {};
  const node = nodes[cur];
  if ( !node ) return null;
  const {id } = node;
  tree[id] = {
    ...node
  }
  if ( canvasName ) tree[id].canvasName = canvasName;

  if ( node.childCanvas || (node as CanvasNode).nodes ) tree[id].children = {};
  if ( node.childCanvas ) {
    Object.keys(node.childCanvas).forEach(canvasName => {
      const virtualId = node.childCanvas[canvasName]
      tree[id].children[virtualId] = nodesToTree(nodes, virtualId, canvasName);
    });
  } else if ( (node as CanvasNode).nodes ) {
    const childNodes = (node as CanvasNode).nodes;
    tree[id].nodes = childNodes;
    childNodes.forEach(nodeId => {
      tree[id].children[nodeId] = nodesToTree(nodes, nodeId);
    });
  }

  return tree[id];
}

export const getDeepChildrenNodes = (nodes: Nodes, id: NodeId, result: NodeId[] = []) => {
  result.push(id);
  const node = nodes[id];
  if ( node.childCanvas ) {
    Object.keys(node.childCanvas).map(canvasName => {
      const virtualId = node.childCanvas[canvasName];
      getDeepChildrenNodes(nodes, virtualId, result);
    })
  } else if ( (node as CanvasNode).nodes ) {
    const childNodes = (node as CanvasNode).nodes;
    childNodes.forEach(nodeId => {
      getDeepChildrenNodes(nodes, nodeId, result);
    });
  }

  return result;
}

export const moveNode = (nodes: Nodes, targetNodeId: NodeId, parentContainerNodeId: NodeId, index: number) => {
  const targetNode = nodes[targetNodeId];

  const currentParentNodes = (nodes[targetNode.parent] as CanvasNode).nodes;
  currentParentNodes[currentParentNodes.indexOf(targetNodeId)] = "marked";
  const newParentNodes = (nodes[parentContainerNodeId] as CanvasNode).nodes;
  newParentNodes.splice(index, 0, targetNodeId);
  nodes[targetNodeId].parent = parentContainerNodeId;

  currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);


  return nodes;
}