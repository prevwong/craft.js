import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { PublicManagerMethods } from "./manager/methods";
import { connectNode, ConnectedPublicNode } from "./nodes/connectors";

export type MsgBox = {
  text: string
} & ConnectedPublicNode

const Msg = ({craft:{node, manager, connectTarget}, text}: MsgBox) => {
  // console.log("render")
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{text}</h2>
    </div>
  )
}

export const MsgBox = connectNode(Msg);