import React, { useEffect, useRef } from "react";
import { Canvas } from "../nodes/Canvas";
import { PublicManagerMethods } from "../manager/methods";
import { isDOMComponent } from "../utils";
import {  connectNode } from "../nodes/connectors";
import { ConnectedPublicNode } from "../interfaces";

export type Render = {
  is: React.ComponentType<any>
} & ConnectedPublicNode

const Render: React.FC<any> = React.memo(({craft:{node, connectTarget}, is, ...injectedProps}: Render) => {
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
  return render;
});

export const RenderNodeToElement = connectNode(Render);