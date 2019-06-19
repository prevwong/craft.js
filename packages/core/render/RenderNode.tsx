import React from "react";
import ReactDOM from "react-dom";
import RenderComp, { ComponentContext } from "./RenderComp";
import { NodeContext, Canvas } from "../nodes";
import TestRender from "./TestRender";
import Editor from "./RenderEditor";


export default class RenderNode extends React.PureComponent<any> {
  hoverWrapper: EventListenerOrEventListenerObject = this.hover.bind(this);
  dom: HTMLElement
  hover(e: MouseEvent) {
    e.stopPropagation();
    const {node, nodeState, builder} = this.context;
    if ( !nodeState.hover ||( nodeState.hover && nodeState.hover.id !== node.id) ) {
      builder.setNodeState("hover", node.id)
    }
  }
  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this) as HTMLElement;
    if ( this.dom ) {
      this.dom.addEventListener("mouseover", this.hoverWrapper);
    }
  }
  
  componentWillUnmount() {
    if ( this.dom ) {
      this.dom.removeEventListener("mouseover", this.hoverWrapper);
    }
  }

  render() {
    const { is, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <ComponentContext.Provider value={{
        Component: Comp,
        props
      }}>
        <NodeContext.Consumer>
          {({node, nodeState, builder}) => {
            return (
              // If it's a Canvas component, it means we have not initialized the Canvas yet, so render it by itself first
              Comp === Canvas ? <Canvas {...props} /> : 
              <TestRender 
                node={node}
                domInfo={builder.nodesInfo[node.id]}
                Component={RenderComp} 
                nodeState={nodeState}
                Editor={Editor}
              />
            )
          }}
        </NodeContext.Consumer>
      </ComponentContext.Provider>
    )
  }
}

RenderNode.contextType = NodeContext;