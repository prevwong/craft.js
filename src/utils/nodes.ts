import React from "react";
import { NodeId, Node } from "~types";

export const createNode = (component: React.ElementType, props: React.Props<any>, id: NodeId, parent?: NodeId): Node => {
    let node: Node = {
      type: component as React.ElementType,
      props
    };
  
    node["id"] = id;
    node["parent"] = parent;
    return node;
  };
  