import React from "react";
import { Container } from "../Container";
import { Canvas } from "craftjs";
import { Video } from "../Video";

export const Custom2 = (props: any) => {
 
  return (
    <Container {...props} className="overflow-hidden">
        <div className="w-24"><h2 className="text-xs text-white">You can only drop<br />one video here.</h2></div>
        <Canvas is="div" id="wow" className="flex-1 ml-5 h-full" canMoveIn={(node) => node.data.type == Video}>
          <Video />
        </Canvas>
    </Container>
  )
}

Custom2.craft = {
  ...Container.craft,
  name: "Custom 2"
}
