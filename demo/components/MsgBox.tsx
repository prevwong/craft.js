import React from "react";
import { ConnectedNode } from "~packages/core/interfaces";
import { connectNode, Canvas, useNode } from "~packages/core/nodes";
import MsgCanvas from "./MsgCanvas";

export type MsgBox = {
  text: string
}

export const Msg: React.FC<MsgBox> = ({children, text}) => {
  const { node, setProp, connectTarget }  = useNode();
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

