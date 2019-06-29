import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { connectNode, ConnectedPublicNode, connectComponent } from "./nodes/NodeContext";

export type MsgBox = {
  text: string
} & ConnectedPublicNode

const Msg = ({node, manager, connectTarget, text}: MsgBox) => {
  console.log("hi")
  return connectTarget(
    <div className="message-box">
      <p>{text}</p>
    </div>
  )
}

export const MsgBox = connectComponent(Msg);