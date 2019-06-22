import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "../utils";
import { NodeContext } from "../nodes/NodeContext";
import { EventContext } from "../events/EventContext";
import { NodeManagerContext } from "../nodes/NodeManagerContext";
import Canvas from "../nodes/Canvas";


export const ComponentContext = React.createContext<any>({

});

export default class RenderComp extends React.PureComponent<any> {
  ref = React.createRef();
  mergedClass: string[] = [];
  componentDidMount() {
  }
  render() {
    return (
      <NodeManagerContext.Consumer>
        {({ nodes }) => {
          return (
            <ComponentContext.Consumer>
              {({ Component, props }: any) => {
                
                return (
                  <NodeContext.Consumer>
                    {({ nodeId }) => {
                      const node = nodes[nodeId]
                      return (
                        <EventContext.Consumer>
                          {({ nodesInfo }) => {
                            const {children, ...otherProps} = props;
                            props = node.nodes && Component !== Canvas ? otherProps : props;
                            console.log(33, node.id, props)
                            return (
                              React.cloneElement(<Component />, {
                                ...props,
                                ...this.props,
                                ref: (ref: any) => {
                                  if (ref) {
                                    const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                                    if (!dom) return;
                                    const info = getDOMInfo(dom)
                                    // console.log(33, nodesInfo/)
                                    if (nodesInfo) nodesInfo[node.id] = info;
                                  }
                                }
                              })
                            )
                          }}
                        </EventContext.Consumer>
                      )
                    }}
                  </NodeContext.Consumer>
                )
              }}
            </ComponentContext.Consumer>
          )
        }}
      </NodeManagerContext.Consumer>
    )
  }
}
