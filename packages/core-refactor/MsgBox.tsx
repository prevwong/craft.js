import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { connectComponent } from "./nodes/NodeContext";

const Msg = ({node, manager, connectTarget}) => {
  return connectTarget(
    <div className="message-box">
      <p>Hi</p>
    </div>
  )
}

export const MsgBox = connectComponent(Msg);