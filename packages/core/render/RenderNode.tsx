import React from "react";
import { Canvas, useNode } from "../nodes";
import { useRenderer } from "./useRenderer";

export const RenderNodeToElement: React.FC<any> = React.memo(({ is, ...injectedProps}) => {
  const {node, connectTarget} = useNode();
  const {onRender} = useRenderer();

  let { type, props } = node.data;
  let {children, ...propsWithoutChildren} = props;

  let Comp = is ? is : type;

  if ( type === Canvas && !is ) {
    return <Canvas  {...props} {...injectedProps} />;
  } 

  let availableProps = props;
  if ( type === Canvas ) {
    const {is, ...withoutIs} = availableProps as any;
    availableProps = withoutIs
  }

  let render = React.cloneElement(<Comp {...availableProps} {...injectedProps} />);
  if ( typeof Comp === 'string') render = connectTarget(render);

  return React.createElement(onRender, {render, node}, null);
});

