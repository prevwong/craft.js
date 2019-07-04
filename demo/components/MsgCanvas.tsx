import React from "react";
import { ConnectedNode } from "~packages/core/interfaces";
import { connectNode } from "~packages/core/nodes";

type MsgCanvas = {
  children: React.ReactChildren
} & ConnectedNode

const MsgCanvas: React.FC<MsgCanvas> = ({children, node, connectTarget}: MsgCanvas) => {
  return connectTarget(
    <hgroup className="msg-canvas">{children}</hgroup>,
    {
      incoming: (incomingNode: Node) => {
        return true;
      },
      outgoing: (outgoingNode: Node) => {
        return false;
      }
    }
  )
}

export default connectNode(MsgCanvas);