import { NodeId, Node } from "../interfaces";
import React, { ReactNode, Fragment } from "react";
import { Canvas } from "./Canvas";
import { createNode } from "../shared/createNode";
const shortid = require("shortid");
const invariant = require('invariant');

export function mapChildrenToNodes(children: ReactNode, parent?: NodeId, hardId?: string): Node[] {
  return React.Children.toArray(children).reduce(
    (result: Node[], child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = React.createElement(Fragment, {}, child);
      }
      let { type, props } = child;

      if (["string", "function"].includes(typeof (type))) {
        const prefix = type === Canvas ? "canvas" : "node";
        const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

        let node = createNode({
          type: type,
          props,
          parent
        }, id);
        
        result.push(node);
        return result;
      }
      invariant(["string", "function"].includes(typeof (type)), "Invalid <Canvas> child provided. Expected simple JSX element or React Component.");

    },
    []
  ) as Node[]
};
