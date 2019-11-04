import React, { useMemo, useContext } from "react";
import { useInternalNode } from "../nodes/useInternalNode";
import { useNode } from "../connectors";
import { Canvas } from "../nodes";
import { useInternalManager } from "../manager/useInternalManager";

export const SimpleElement = ({render}: any) => {
  const {connectTarget, connectDragHandler } = useNode();

  return typeof render.type === "string" ? connectTarget(connectDragHandler(React.cloneElement(render, {draggable: true}))) : render;
}

export const RenderNodeToElement: React.FC<any> = ({ ...injectedProps}: any) => {
  const { type, props } = useInternalNode((node) => ({type: node.data.type, props: node.data.props}));
  const { query: { getOptions }} = useInternalManager();
  const {onRender} = getOptions();

  let Comp = type;
  let render = React.cloneElement(<Comp {...props} {...injectedProps}  />);
  if (typeof Comp === 'string') render = <SimpleElement render={render} />
  // To indicate the <Canvas /> is part of another Canvas' children
  else if (Comp == Canvas ) render = React.cloneElement(render, {passThrough: true}); 

  return React.createElement(onRender, {render}, null);
  
};

