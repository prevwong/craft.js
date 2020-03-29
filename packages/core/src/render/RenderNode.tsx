import React from "react";
import { useNode } from "../hooks/useNode";
import { Canvas } from "../nodes/Canvas";
import { useInternalEditor } from "../editor/useInternalEditor";
import { SimpleElement } from "./SimpleElement";

export const RenderNodeToElement: React.FC<any> = ({ ...injectedProps }) => {
  const { type, props, isCanvas, hidden } = useNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    isCanvas: node.data.isCanvas,
    hidden: node.data.hidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  let Comp = isCanvas ? Canvas : type;
  let render = React.cloneElement(<Comp {...props} {...injectedProps} />);
  if (typeof Comp === "string") render = <SimpleElement render={render} />;
  else if (Comp === Canvas)
    render = React.cloneElement(render, { passThrough: true });

  return !hidden ? React.createElement(onRender, { render }, null) : null;
};
