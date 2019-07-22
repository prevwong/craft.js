import React from "react";
import {  Canvas } from "~packages/core/nodes";
import MsgCanvas from "./MsgCanvas";
import { useNode } from "~packages/core/connectors";

export type MsgBox = {
  text: string
}

export const Msg: React.FC<MsgBox> = ({children, text}) => {
  const { actions: { setProp }, connectTarget, active}  = useNode((state) => ({active: state.ref.event.active}));
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{text}</h2>
      <a onClick={() => {
        setProp((props: MsgBox) => {
          props.text = "whut"
        });
      }}>Click me</a>
      <Canvas id="Msgca" style={{ background: '#999', padding: '50px 0' }}>
        <h2>Hi ad</h2>
      </Canvas>
    </div>
  )
}

