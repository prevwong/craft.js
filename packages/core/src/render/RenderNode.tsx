import React from "react";
import { useInternalNode } from "../nodes/useInternalNode";
import { useNode } from "../connectors";
import { Canvas } from "../nodes";
import { useInternalEditor } from "../editor/useInternalEditor";

export const SimpleElement = ({render}: any) => {
  const { connectors: {connect, drag} } = useNode();

  return typeof render.type === "string" ? connect(drag(React.cloneElement(render))) : render;
}

export const RenderNodeToElement: React.FC<any> = ({ ...injectedProps}: any) => {
  const { type, props, isCanvas, hidden } = useInternalNode((node) => ({
    type: node.data.type, 
    props: node.data.props, 
    isCanvas: node.data.isCanvas,
    hidden: node.data.hidden
  }));

  const { onRender } = useInternalEditor((state) => ({ onRender: state.options.onRender }));

  let Comp = isCanvas ? Canvas : type;
  let render = React.cloneElement(<Comp {...props} {...injectedProps}  />);
  if (typeof Comp === 'string') render = <SimpleElement render={render} />
  else if (Comp == Canvas ) render = React.cloneElement(render, {passThrough: true}); 
  
  return !hidden && React.createElement(onRender, {render}, null);
  
};

