import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "../utils";
import BuilderContext from "../BuilderContext";
import RenderComp, { ComponentContext } from "./RenderComp";
import { NodeContext } from "../nodes";
import TestRender from "./TestRender";
import Editor from "./RenderEditor";

export default class RenderNode extends React.PureComponent<any> {
  
  render() {
    const { is, node, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <ComponentContext.Provider value={{
        Component: Comp,
        props
      }}>
        <NodeContext.Consumer>
          {({node, nodeState, builder}) => {
            return (
              <TestRender 
                node={node}
                domInfo={builder.nodesInfo[node.id]}
                Component={RenderComp} 
                nodeState={nodeState}
                Editor={Editor}
                ref={(ref) => {
                  if ( ref ) {
                    const dom = ReactDOM.findDOMNode(ref);
                    if ( dom ) {
                      dom.addEventListener("mouseover", (e: MouseEvent) => {
                        e.stopImmediatePropagation();
                        if ( !nodeState.hover ||( nodeState.hover && nodeState.hover.id !== node.id) ) builder.setNodeState("hover", node.id)
                      });
                    }
                  }
                }}
              />
            )
          }}
        </NodeContext.Consumer>
      </ComponentContext.Provider>
    )
  }
}

RenderNode.contextType = BuilderContext;