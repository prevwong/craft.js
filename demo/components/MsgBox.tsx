import React from "react";
import { ConnectedNode } from "~packages/core/interfaces";
import { connectNode, Canvas } from "~packages/core/nodes";
import MsgCanvas from "./MsgCanvas";

export type MsgBox = {
  text: string
} & ConnectedNode

const Msg: React.FC<MsgBox> = ({node, setProp, connectTarget, children, text}) => {
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{text}</h2>
      <a onClick={() => {
        setProp((props: MsgBox) => {
          props.text = "whut"
        });
      }}>Click me</a>
      <Canvas id="Msgca" is={MsgCanvas}>
        <h2>Hi</h2>
      </Canvas>
    </div>
  )
}

export const MsgBox = connectNode(Msg);