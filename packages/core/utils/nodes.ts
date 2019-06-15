import React, { ReactNode } from "react";
import { NodeId, Node, Nodes } from "~types";
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
      const prefix = (type as Function) === Canvas ? "canvas" : "node";
      const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

      let node = createNode(type as React.ElementType, props, id, parent);
      result[node.id] = node;
      return result;
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
  