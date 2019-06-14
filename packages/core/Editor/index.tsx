import React from "react";
import NodeContext from "../Nodes/NodeContext";
import { NodeContextState, Node, CraftComponent } from "~types";
import { isCraftComponent } from "~src/utils";

export default class Editor extends React.PureComponent {
    render() {
        return (
            <NodeContext.Consumer>
            {({ node }: NodeContextState ) => {
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