import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "craftjs";


export default function Card() {
  const {connect, drag} = useNode();
  return (
    <MaterialCard ref={ref=> connect(drag(ref))} style={{marginBottom: "20px"}}>
      <CardContent>
        <Canvas id="main">
          <Text variant="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula est quis dignissim placerat. Pellentesque aliquam ante a molestie porttitor. 
          </Text>
        </Canvas>
        <Canvas id="second">
          <Button variant="contained">Click</Button>
        </Canvas>
      </CardContent>
    </MaterialCard>
  )
}