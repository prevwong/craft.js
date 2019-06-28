import React, { useEffect, useRef } from "react";
import { Canvas } from "../nodes/Canvas";
import { connectInternalNode } from "../nodes/NodeContext";


const Render = React.memo(({node, is, manager, events, ...passedProps}: any) => {
  let { type, props, nodes } = node;
  const Comp = is ? is : type;
  const ref = useRef(null);

  if ( type === Canvas && !is ) return <Canvas {...props} />;

  return (
    React.cloneElement(<Comp {...props}/>, {
      ...passedProps
    })
  )
});

export const RenderNodeToElement = connectInternalNode(Render);


// export const RenderElement = React.memo(({type: Comp, ...props}: any) => {
//   return (
//     <Comp {...props} />
//   )
// })


