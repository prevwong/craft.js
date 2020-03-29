import React, { Fragment } from "react";
import { Canvas } from "../nodes/Canvas";
import { NodeId, NodeData } from "../interfaces";
import { createNode } from "./createNode";
const shortid = require("shortid");

type Extras = { id: NodeId | null; data: Partial<NodeData> };
export function transformJSXToNode(
  child: React.ReactElement | string,
  extras: Extras = { id: null, data: {} }
) {
  if (typeof child === "string") {
    child = React.createElement(Fragment, {}, child);
  }
  let { type, props } = child;
  const prefix = type === Canvas || extras.data.isCanvas ? "canvas" : "node";
  const id = extras.id ? extras.id : `${prefix}-${shortid.generate()}`;

  const mergedProps = {
    ...props,
    ...(extras && extras.data && extras.data.props ? extras.data.props : {}),
  };

  return createNode(
    {
      ...extras.data,
      type: type,
      props: mergedProps,
    },
    id
  );
}
