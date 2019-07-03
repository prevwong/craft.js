import React from "react";
import { Canvas } from "./nodes/Canvas";
import { Heading } from "./Heading";
import { connectNode } from "./nodes/connectors";
import MsgCanvas from "./MsgCanvas";
import { ConnectedNode } from "./interfaces";

export type MsgBox = {
  text: string
} & ConnectedNode

const Msg: React.FC<MsgBox> = ({node, setProp, connectTarget, children, text}) => {
  console.log("Re0render")
  return connectTarget(
    <div className="message-box" >
      <h2>MESSAGE{children}</h2>
      <a onClick={() => {
        setProp((props) => {
          props.children = <a>Whaat</a>
        });
      }}>Click me</a>
    </div>
  )
}

export const MsgBox = connectNode(Msg);