import React, { useMemo } from "react";
import { Canvas, useNode } from "../nodes";
import { useRenderer } from "./useRenderer";
import { useInternalNode } from "../nodes/useInternalNode";

export const SimpleElement = ({render}: any) => {
  const {connectTarget} = useNode();
  return connectTarget(render);
}

export const RenderNodeToElement: React.FC<any> = React.memo(({ ...injectedProps}) => {
  const {node} = useInternalNode();
  const {onRender} = useRenderer();

  let { type, props } = node.data;

  let Comp = type;

  let render = React.cloneElement(<Comp {...props} {...injectedProps} />);
  if ( typeof Comp === 'string') render = <SimpleElement render={render} />

  return useMemo(() => React.createElement(onRender, { render, node }, null), [node.data]);
});

