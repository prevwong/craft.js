import React from "react";
import { connectNode } from "./nodes";
import { ConnectedNode, ConnectedPublicNode, Node } from "./interfaces";

type MsgCanvas = {
  children: React.ReactChildren
} & ConnectedPublicNode

const MsgCanvas: React.FC<MsgCanvas> = ({children, craft: {node, connectTarget}}: MsgCanvas) => {
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