import React from "react";
import { connectNode } from "./nodes";
import { ConnectedNode, ConnectedPublicNode, Node } from "./interfaces";

type AnotherCanvas = {
  children: React.ReactChildren
} & ConnectedPublicNode

const AnotherCanvas: React.FC<AnotherCanvas> = ({children, craft: {node, connectTarget}}: AnotherCanvas) => {
  return connectTarget(
    <hgroup style={{background:"#eee", padding:"20px 30px"}} className="another-canvas">{children}</hgroup>,
    {
      incoming: (incomingNode: Node) => {
        // if ( incomingNode.data.props.children === 'Order1') return false;
        return true;
      }
    }
  )
}

export default connectNode(AnotherCanvas);