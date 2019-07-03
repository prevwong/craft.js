import { NodeId, Node } from "../interfaces";
import React, { ReactNode, Fragment } from "react";
import { Canvas } from "./Canvas";
import { createNode } from "../shared/createNode";
const shortid = require("shortid");


export function mapChildrenToNodes(children: ReactNode, parent?: NodeId, hardId?: string): Node[] {
  return React.Children.toArray(children).reduce(
    (result: Node[], child: React.ReactElement | string) => {
      if (typeof (child) === "string") {
        child = React.createElement(Fragment, {}, child);
      }
      let { type, props } = child;

      if ( ["string", "function"].includes(typeof(type))) { 
        const prefix = (type as Function) === Canvas ? "canvas" : "node";
        const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

        let node = createNode(type as React.ElementType, props, id, parent);
        result.push(node);
        return result;
      } else {
        throw new Error("Invalid <Canvas> child provided. Expected simple JSX element or React Component.");
      }
    },
    []
  ) as Node[]
};
