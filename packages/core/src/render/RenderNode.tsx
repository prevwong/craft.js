import React from "react";
import { useInternalEditor } from "../editor/useInternalEditor";
import { NodeElement } from "../nodes/NodeElement";
import { SimpleElement } from "./SimpleElement";
import { NodeId } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";

const Render = () => {
  const { type, props, nodes } = useInternalNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
  }));

  return React.createElement(
    typeof type == "string" ? SimpleElement : type,
    props,
    <React.Fragment>
      {nodes
        ? nodes.map((id: NodeId) => <NodeElement id={id} key={id} />)
        : props && props.children && props.children}
    </React.Fragment>
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
