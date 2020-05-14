import React from "react";
import { useInternalEditor } from "../editor/useInternalEditor";
import { useNode } from "../hooks/useNode";
import { Canvas } from "../nodes/Canvas";
import { SimpleElement } from "./SimpleElement";

const Render = (injectedProps) => {
  const { type, props, isCanvas } = useNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    isCanvas: node.data.isCanvas,
  }));

  if (isCanvas) {
    return <Canvas {...props} {...injectedProps} passThrough />;
  }

  const Component = type;
  const render = <Component {...props} {...injectedProps} />;

  if (typeof Component === "string") {
    return <SimpleElement render={render} />;
  }

  return render;
};

export const RenderNodeToElement: React.FC<any> = (injectedProps) => {
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
