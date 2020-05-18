import React, { useEffect, useMemo } from "react";
import { useInternalEditor } from "../editor/useInternalEditor";
import { NodeElement } from "../nodes/NodeElement";
import { SimpleElement } from "./SimpleElement";
import { NodeId } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";

const Render = () => {
  const { type, props, nodes, hydration } = useInternalNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
    hydration: node._hydrationTimestamp,
  }));

  return useMemo(
    () =>
      React.createElement(
        typeof type == "string" ? SimpleElement : type,
        props,
        <React.Fragment>
          {nodes
            ? nodes.map((id: NodeId) => <NodeElement id={id} key={id} />)
            : props && props.children && props.children}
        </React.Fragment>
      ),
    [type, props, nodes, hydration]
  );
};

export const RenderNodeToElement: React.FC<any> = () => {
  const { isHidden } = useInternalNode((node) => ({
    isHidden: node.data.isHidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  // don't display the node since it's hidden
  if (isHidden) {
    return null;
  }

  return React.createElement(onRender, { render: <Render /> });
};
