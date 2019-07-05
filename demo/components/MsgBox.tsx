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
      <Canvas id="Msgca" is={MsgCanvas} style={{ background: '#999', padding: '20px 0' }}>
        <h2>Hi world</h2>
      </Canvas>
    </div>,
    {
      incoming: () => true
    }
  )
}

export const MsgBox = connectNode(Msg);