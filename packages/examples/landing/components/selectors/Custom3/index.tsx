import React from "react";
import { Container } from "../Container";
import { Canvas, useEditor} from "@craftjs/core";
import { Button } from "../Button";

export const Custom3 = (props: any) => {
  
  const {query} = useEditor();

  return (
    <Container {...props} className="overflow-hidden">
        <div className="w-full mb-4"><h2 className="text-center text-xs text-white">I must have at least 1 button</h2></div>
          <Canvas is="div" id="wow" className="w-full h-full" canMoveOut={(node, self) => {
              const {data:{nodes}} = self;
              const btnNodes = nodes.filter(id => query.getNode(id).data.type == Button);
              if ( node.data.type == Button && btnNodes.length == 1 ) return false;
              return true;
          }}>
          <Button background={{r:184, g:247, b:247, a:1}} />
        </Canvas>
    </Container>
  )
}

Custom3.craft = {
  ...Container.craft,
  name: "Custom 3"
}
