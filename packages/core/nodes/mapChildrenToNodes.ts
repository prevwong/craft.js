import { NodeId, Node, NodeData } from "../interfaces";
import React, { ReactNode, Fragment } from "react";
import { Canvas } from "./Canvas";
const shortid = require("shortid");

type MapChildrenData = {
  parent?: NodeId,
  hardId?: NodeId
}
export function mapChildrenToNodes(children: ReactNode, cb:(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id: NodeId) => any, {hardId, parent}: MapChildrenData = {}): Node[] {
  return React.Children.toArray(children).reduce(
    (result: Node[], child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = React.createElement(Fragment, {}, child);
      }
      let { type, props } = child;

      // if (["string", "function"].includes(typeof (type))) {
        const prefix = type === Canvas ? "canvas" : "node";
        const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

        let node = cb({
          type: type,
          props,
          parent
        }, id);
        
        result.push(node);
        return result;
      // }
      // invariant(["string", "function"].includes(typeof (type)), "Invalid <Canvas> child provided. Expected simple JSX element or React Component.");

    },
    []
  ) as Node[]
};
