import React from "react";
import { ConnectedNode, Node } from "~packages/core/interfaces";
import { useNode } from "~packages/core/connectors";

type MsgCanvas = {
  children: React.ReactChildren
} & ConnectedNode

const MsgCanvas: React.FC<MsgCanvas> = ({children, ...props}: MsgCanvas) => {
  const { connectTarget } = useNode();
  return connectTarget(
    <hgroup style={{padding: "20px 0"}} className="msg-canvas" {...props}>{children}</hgroup>,
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

export default MsgCanvas;