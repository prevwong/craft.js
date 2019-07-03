import React from "react";
import { Canvas } from "../nodes/Canvas";
import { isDOMComponent } from "../utils";
import useNode from "../nodes/useNode";
import { useRenderer } from "./RenderContext";

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
  if ( isDOMComponent(Comp)) render = connectTarget(render);

  return React.createElement(onRender, {render, node}, null);
});

