import { NodeId, Node } from "../interfaces";
import React, { ReactNode } from "react";
import { transformJSXToNode } from "../utils/transformJSX";

type MapChildrenData = {
  parent?: NodeId,
  hardId?: NodeId
}
export function mapChildrenToNodes(children: ReactNode, { hardId, parent }: MapChildrenData = {}, cb?: (data: Node) => any): Node[] {
  return React.Children.toArray(children).reduce(
    (result: Node[], child: React.ReactElement | string) => {
      let node = transformJSXToNode(child, hardId, parent);
      if ( cb ) node = cb(node);
      result.push(node);
      return result;
    },
    []
  ) as Node[]
};
