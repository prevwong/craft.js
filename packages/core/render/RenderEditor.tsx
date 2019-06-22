import React from "react";
import { NodeContextState, Node, CraftComponent } from "~types";
import { isCraftComponent } from "../utils";
import { NodeContext } from "../nodes/NodeContext";

export default class Editor extends React.PureComponent {
  render() {
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContext ) => {
          const { type: Component, props } = node as Node;
          if ( isCraftComponent(Component) ){
            const Editor = (Component as CraftComponent).editor;
            return <Editor props={props} />
          } else {
              return null;
          }
        }}
      </NodeContext.Consumer>
    )
  }
}