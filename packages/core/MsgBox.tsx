import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { connectNode } from "./nodes/connectors";
import MsgCanvas from "./MsgCanvas";
import { ConnectedNode } from "./interfaces";

export type MsgBox = {
  text: string
} & ConnectedNode

const Msg = ({node, setProp, connectTarget, text}: MsgBox) => {
  console.log("Re0render")
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{text}</h2>
      <a onClick={() => {
        setProp('text', 'WHAAAT')
        // console.log(node.ref.props)
      }}>Click me</a>
    </div>
  )
}

export const MsgBox = connectNode(Msg);