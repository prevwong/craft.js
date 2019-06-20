import React from "react";
import ReactDOM from "react-dom";
import RenderNode from "./RenderNode";
import NodeContext from "../nodes/NodeContext";
import cx from "classnames";
import { Canvas } from "../nodes";
import BuilderContext from "../BuilderContext";
import { getDOMInfo } from "../utils";
import { css } from "styled-components";
import { DNDContext } from "../dnd";


export const ComponentContext = React.createContext<any>({

});

export default class RenderComp extends React.PureComponent<any> {
  ref = React.createRef();
  mergedClass: string[] = [];
  componentDidMount() {
  }
  render() {
    return (
      <ComponentContext.Consumer>
        {({ Component, props }: any ) => {
          return (
            <NodeContext.Consumer>
              {({node, builder}) => {
                return (
                  <DNDContext.Consumer>
                    {({nodesInfo}) => {
                      return (
                        <Component 
                          {...props} 
                          ref={(ref: any) => {
                          if (ref) {
                            const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                            if(!dom) return;
                            const info = getDOMInfo(dom)
                            if (nodesInfo) nodesInfo[node.id] = info;

                            const {className, style} = this.props;
                            if ( className ) {
                              const classes = className.split(" ").filter((cssClass: string) => cssClass !== "");

                              [...classes, ...this.mergedClass].forEach(cssClass => {
                                if ( !this.mergedClass.includes(cssClass) ) {
                                  dom.classList.add(cssClass)
                                  this.mergedClass.push(cssClass);
                                } else if ( dom.classList.contains(cssClass) && !classes.includes(cssClass) ) {
                                  dom.classList.remove(cssClass);
                                  this.mergedClass.splice(this.mergedClass.indexOf(cssClass), 1);
                                }
                              });
                            }
                          }}} 
                          {...this.props}  
                        />
                      )
                    }}
                  </DNDContext.Consumer>
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