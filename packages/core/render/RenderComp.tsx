import React from "react";
import ReactDOM from "react-dom";
import RenderNode from "./RenderNode";
import NodeContext from "../nodes/NodeContext";
import cx from "classnames";
import { Canvas } from "../nodes";
import BuilderContext from "../BuilderContext";
import { getDOMInfo } from "../utils";


export const ComponentContext = React.createContext();

export default class RenderComp extends React.PureComponent<any> {
  render() {
    
    return (
      <ComponentContext.Consumer>
        {({ Component, props }: any ) => {
          return (
            <NodeContext.Consumer>
              {({node, builder}) => {
                return (
                  <Component 
                    {...props} 
                    {...this.props}
                    ref={(ref) => {
                    if (ref) {
                      const { nodesInfo } = builder;
                      const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                      if(!dom) return;
                      const info = getDOMInfo(dom)
      
                      if (nodesInfo) nodesInfo[node.id] = info;
                    }
                  }} />
                )
              }}
            </NodeContext.Consumer>
          )
        }}
      </ComponentContext.Consumer>
    )
  }
}


RenderComp.contextType = BuilderContext;