import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { PublicManagerMethods } from "./manager/methods";
import { connectNode } from "./nodes/connectors";
import MsgCanvas from "./MsgCanvas";
import { ConnectedPublicNode } from "./interfaces";

export type MsgBox = {
  text: string
} & ConnectedPublicNode

const Msg = ({craft:{node, manager, connectTarget}, text}: MsgBox) => {
  console.log("render33")
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{text}</h2>
      <Canvas id="Msgcanvas" is={MsgCanvas}>
        <p>Order1</p>
        <p>Order2</p>
        <Canvas style={{background:"#000", padding:"5px", color:"#fff"}}>
          <p>Order3</p>
        </Canvas>
      </Canvas>
    </div>
  )
}

export const MsgBox = connectNode(Msg);