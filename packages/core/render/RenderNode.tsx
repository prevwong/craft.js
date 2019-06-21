import React from "react";
import ReactDOM from "react-dom";
import RenderComp, { ComponentContext } from "./RenderComp";
import { NodeContext, Canvas } from "../nodes";
import TestRender from "./TestRender";
import Editor from "./RenderEditor";
import DNDContext from "../dnd/DNDContext";

export default class RenderNode extends React.PureComponent<any> {
  render() {
    const { is, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
        <NodeContext.Consumer>
          {({node, nodeState, builder}) => {
            return (
              <DNDContext.Consumer>
                {({hover, setNodeEvent}) => {
                  return (
                    <ComponentContext.Provider value={{
                      Component: Comp,
                      props: {
                        ...props,
                        onMouseOver: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if ( !hover ||( hover && hover.node.id !== node.id) ) {
                            setNodeEvent("hover", node);
                          }
                        }
                      }
                    }}>
                      {
                        Comp === Canvas ? <Canvas {...props} /> : 
                        <TestRender  
                          node={node}
                          Component={RenderComp} 
                          nodeState={nodeState}
                          Editor={Editor} 
                        />
                      }
                    </ComponentContext.Provider>
                  )
                }}
              </DNDContext.Consumer>
            )
          }}
        </NodeContext.Consumer>
    )
  }
}

RenderNode.contextType = NodeContext;