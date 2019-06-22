import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "../utils";
import { NodeContext } from "../nodes/NodeContext";
import EventContext from "../events/EventContext";


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
              {({node, api}) => {
                return (
                  <EventContext.Consumer>
                    {({nodesInfo}) => {
                      return (
                        React.cloneElement(<Component />, {
                          ...props,
                          ...this.props,
                          ref: (ref: any) => {
                            if ( ref ) {
                              const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                              if(!dom) return;
                              const info = getDOMInfo(dom)
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
  }
}
