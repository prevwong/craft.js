import React from "react";
import { useInternalEditor } from "../editor/useInternalEditor";
import { useNode } from "../hooks/useNode";
import { NodeElement } from "../nodes/NodeElement";
import { SimpleElement } from "./SimpleElement";
import { NodeId } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";

const Render = () => {
  const { nodes, type, props } = useInternalNode((node) => ({
    nodes: node.data.nodes,
    type: node.data.type,
    props: node.data.props,
  }));

  if (!type) return null;

  const render = React.createElement(
    type,
    props,
    <React.Fragment>
      {nodes
        ? nodes.map((id: NodeId) => {
            return <NodeElement id={id} key={id} />;
          })
        : props && props.children}
    </React.Fragment>
  );

  return <SimpleElement render={render} />;
};

export const RenderNodeToElement: React.FC<any> = () => {
  const { hidden } = useNode((node) => ({
    hidden: node.data.hidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }

  return React.createElement(onRender, { render: <Render /> });
};
