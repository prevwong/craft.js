import React, { Fragment } from "react";
import { Node } from "../interfaces";
import { createNode } from "./createNode";

export function transformJSXToNode(
  child: React.ReactElement,
  normalise: (jsx: React.ReactElement, node: Node) => void
) {
  if (typeof child === "string") {
    child = React.createElement(Fragment, {}, child);
  }

  let node = createNode(child, (node) => {
    normalise && normalise(child, node);
  });

  return node;
}
