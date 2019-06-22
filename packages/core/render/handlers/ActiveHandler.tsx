import React from "react";
import ReactDOM from "react-dom";
import { NodeContext } from "~packages/core/nodes/NodeContext";
import { EventContext } from "~packages/core/events/EventContext";

export default class ActiveHandler extends React.Component<any> {
    // clickWrapper: EventListenerOrEventListenerObject = this.click.bind(this);
    dom: HTMLElement
    // click(e: MouseEvent) {
    //     e.stopImmediatePropagation();
    //     e.stopPropagation();
    //     if (e.which !== 1) return;
    //     const {node, api} = this.context;
    //     const {setNodeEvent } = api;

    //     setNodeEvent("active", node.id);
    // }

    // componentDidMount() {
    //     this.dom = ReactDOM.findDOMNode(this) as HTMLElement;
    //     this.dom.addEventListener("mousedown", this.clickWrapper);
    // }

    // componentWillUnmount(){
    //     if ( this.dom ) this.dom.removeEventListener("mousedown", this.clickWrapper);
    // }

    render() {
        const {is: Comp, ...props} = this.props;
        return (
           <NodeContext.Consumer>
             {({node}) => {
               return (
                <EventContext.Consumer>
                    {({methods:{setNodeEvent}}) => {
                      return (
                      <Comp {...props} onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        console.log("clkicked.")
                        setNodeEvent("active", node.id)
                      }} />
                      )
                    }}
                  </EventContext.Consumer>
               )
             }}
           </NodeContext.Consumer>
        )
    }
}

ActiveHandler.contextType = NodeContext;