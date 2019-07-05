import React from "react";
import { ConnectedNode } from "~packages/core/interfaces";
import { connectNode } from "~packages/core/nodes";

type MsgCanvas = {
  children: React.ReactChildren
} & ConnectedNode

const MsgCanvas: React.FC<MsgCanvas> = ({children, node, connectTarget, setProp, ...props}: MsgCanvas) => {
  return connectTarget(
    <hgroup className="msg-canvas" {...props}>{children}</hgroup>,
    {
      incoming: (incomingNode: Node) => {
        return true;
      },
      outgoing: (outgoingNode: Node) => {
        return true;
      }
    }
  )
}

export default connectNode(MsgCanvas);