import React, { useEffect, useRef } from "react";
import { Canvas } from "../nodes/Canvas";
import { connectInternalNode, ConnectedNode } from "../nodes/NodeContext";
import { PublicManagerMethods } from "../manager/methods";

export type Render = {
  is: React.ComponentType<any>
} & ConnectedNode<PublicManagerMethods>

const Render: React.FC<any> = React.memo(({node, is}: Render) => {
  let { type, props } = node;
  
  const Comp = is ? is : type;

  if ( type === Canvas && !is ) {
    console.log("go canvsa");
    const {children, ...otherProps} = props;
    return <Canvas {...otherProps} />;
  }

  return (
    React.cloneElement(<Comp {...props}/>)
  )
});

export const RenderNodeToElement = connectInternalNode(Render);


// export const RenderElement = React.memo(({type: Comp, ...props}: any) => {
//   return (
//     <Comp {...props} />
//   )
// })


