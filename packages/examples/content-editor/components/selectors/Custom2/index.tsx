import React from "react";
import { Container } from "../Container";
import { Canvas, useNode } from "craftjs";
import { Button } from "../Button";
import { Video } from "../Video";

export const Custom2 = (props: any) => {
  const {actions: {setProp}, active, id} = useNode((node) => ({
    active: node.event.active
  }));

  return (
    <Container {...props} className="overflow-hidden">
        <div className="w-24"><h2 className="text-xs text-white">You can only drop<br />one video here.</h2></div>
        <Canvas is="div" id="wow" className="flex-1 ml-5 h-full" incoming={(node) => node.data.type == Video}>
          <Video />
        </Canvas>
    </Container>
  )
}

Custom2.craft = {
  ...Container.craft,
  name: "Custom 2"
}
