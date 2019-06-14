import React, { ReactNode, HTMLProps } from "react";
import { Node, NodeId, Nodes } from "~types";
import Canvas from ".";
import { defineReactiveProperty, TextNode } from "~src/utils";
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

export const mapChildrenToNodes = (children: ReactNode, parent?: NodeId, hardId?: string, cb?: Function): Nodes => {
  return React.Children.toArray(children).reduce(
    (result: Nodes, child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = <TextNode text={child} />
      }

      let { type, props } = child;
      const prefix = (type as Function) === Canvas ? "canvas" : "node";
      const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

      let node = createNode(type as React.ElementType, props, id, parent);
      result[node.id] = node;
      if ( cb ) cb(node);
      return result;
    },
    {}
  ) as Nodes;
};


export const makePropsReactive = (nodes: Nodes, cb: Function) => {
  Object.keys(nodes).forEach(id => {
    const node = nodes[id];
    let {props} = node;
    const reactiveProps = Object.keys(props).reduce((result, key) => {
      if ( key !== "children" ) {
        const value = (props as any)[key];
        defineReactiveProperty(result, key, value, () => {
          cb()
        });
      }
      return result;
    }, {});
    node.props = reactiveProps;
  })
}