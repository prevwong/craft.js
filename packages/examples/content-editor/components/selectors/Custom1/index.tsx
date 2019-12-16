import React from "react";
import { Container } from "../Container";
import { Canvas } from "craftjs";
import { Button } from "../Button";

export const Custom1 = (props: any) => {
  return (
    <Container {...props}>
      <h2 className="text-lg px-10 py-5 text-white">I'm a component that only accepts<br/> buttons.</h2>
      <Canvas is="div" id="wow" className="w-full mt-5" canMoveIn={(node) => node.data.type == Button}>
        <Button />
        <Button buttonStyle="outline" color={{r:255,g:255,b:255,a:1}}/>
      </Canvas>
    </Container>
  )
}

Custom1.craft = {
  ...Container.craft,
  name: "Custom 1"
}
