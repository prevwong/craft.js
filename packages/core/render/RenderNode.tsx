import React, { useEffect, useRef, useMemo } from "react";
import { Canvas } from "../nodes/Canvas";
import { PublicManagerMethods } from "../manager/methods";
import { isDOMComponent } from "../utils";
import {  connectNode, connectInternalNode } from "../nodes/connectors";
import { ConnectedPublicNode, ConnectedInternalNode } from "../interfaces";

export type Render = {
  is: React.ComponentType<any>
} & ConnectedInternalNode

const RenderComp = ({node, render}: any) => {
  return (
    {render}
  )
}

const Render: React.FC<any> = React.memo(({craft:{node, connectTarget, manager}, renderer, is, ...injectedProps}: Render) => {
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

  return React.createElement(renderer.onRender, {render, node}, null);
});

export const RenderNodeToElement = connectInternalNode(Render);