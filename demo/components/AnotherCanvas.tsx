import React from "react";
import { ConnectedNode } from "~packages/core/interfaces";
import { connectNode } from "~packages/core/nodes";

type AnotherCanvas = {
  children: React.ReactChildren
} & ConnectedNode

const AnotherCanvas: React.FC<AnotherCanvas> = ({children, node, connectTarget}: AnotherCanvas) => {
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