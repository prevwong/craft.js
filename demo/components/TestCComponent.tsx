import React from "react";
import { connectManager } from "~packages/core/connectors/legacy/connectManager";
import { ManagerState, Node, ConnectedNode, ConnectedManager } from "~packages/core";
import { connectNode } from "~packages/core/connectors/legacy/connectNode";

class Test extends React.Component<ConnectedManager & ConnectedNode<ReturnType<typeof collect>>> {
  render() {
    const { query, event, connectTarget} = this.props;
    console.log(query);
    return connectTarget(
      <h2>hajaji</h2>
    )
  }
}


const collect = (state: Node) => ({
  event: state.ref.event.active
});

export default connectManager()(connectNode(collect)(Test));