import React, { ReactNode } from "react";
import { Node, id, NodeId, Nodes } from "~types";
import Canvas from ".";
const shortid = require("shortid");

const TextNode = (props: { text: string }): React.ReactElement => {
  return (
    <React.Fragment>
      {props.text}
    </React.Fragment>
  )
}

export const createNode = (component: React.ElementType, props: React.Props<any>, id: NodeId, parent?: NodeId): Node => {
  // const { draggable } = props;
  let node: Node = {
    name: typeof component === "string" ? component : (component as Function).name,
    component: component as React.ElementType,
    props,
    // draggable: draggable === undefined || draggable === null ? true : !!draggable
  };

  node["id"] = id;

  node["parent"] = parent;
  return node;
};

export const mapChildrenToNodes = (children: ReactNode, parent?: NodeId, hardId?: string): Nodes => {
  return React.Children.toArray(children).reduce(
    (result: Nodes, child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = <TextNode text={child} />
      }

      let { type, props } = child;

      const prefix = type === Canvas ? "canvas" : "node";
      const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

      let node = createNode(type as React.ElementType, props, id, parent);

      result[node.id] = node;
      return result;
    },
    {}
  ) as Nodes;
};
