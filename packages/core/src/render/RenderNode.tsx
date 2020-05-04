import React, { useState, useEffect } from "react";
import { useInternalEditor } from "../editor/useInternalEditor";
import { useNode } from "../hooks/useNode";
import { NodeElement } from "../nodes/NodeElement";
import { SimpleElement } from "./SimpleElement";
import { NodeId } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";

const Render = () => {
  const { internalNode } = useInternalNode((node) => ({
    internalNode: {
      id: node.id,
      data: node.data,
    },
  }));
  const [node, setNode] = useState(null);

  // This is to handle situations when a Node gets deleted
  useEffect(() => {
    if (internalNode && internalNode.data.type != null) {
      setNode(internalNode);
    }
  }, [internalNode]);

  if (!node) return null;

  return (
    <SimpleElement
      render={React.createElement(
        node.data.type,
        node.data.props,
        <React.Fragment>
          {node.data.nodes
            ? node.data.nodes.map((id: NodeId) => (
                <NodeElement id={id} key={id} />
              ))
            : node.data.props.children && node.data.props.children}
        </React.Fragment>
      )}
    />
  );
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
