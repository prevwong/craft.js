import React, { ReactNode } from "react";
import { Node, id, NodeId, Nodes } from "~types";
const shortid = require("shortid");

const TextNode = (props: { text: string }): React.ReactElement => {
  return (
    <React.Fragment>
      {props.text}
    </React.Fragment>
  )
}

export const createNode = (component: React.ElementType, props: React.Props<any>, parent: NodeId): Node => {
  // const { draggable } = props;
  let node: Node = {
    name: typeof component === "string" ? component : (component as Function).name,
    component: component as React.ElementType,
    props,
    // draggable: draggable === undefined || draggable === null ? true : !!draggable
  };
  node["id"] = `node-${shortid.generate()}`;
  node["parent"] = parent;
  return node;
};

export const mapChildrenToNodes = (children: ReactNode, parent?: NodeId): Nodes => {
  return React.Children.toArray(children).reduce(
    (result: Nodes, child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = <TextNode text={child} />
      }

      let { type, props } = child;

      let node = createNode(type as React.ElementType, props, parent);

      result[node.id] = node;
      return result;
    },
    {}
  ) as Nodes;
};
