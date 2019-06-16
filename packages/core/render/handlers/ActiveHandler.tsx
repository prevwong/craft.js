import React from "react";
import { NodeContext } from "~packages/core/nodes";
import ReactDOM from "react-dom";

export default class ActiveHandler extends React.Component {
    clickWrapper: EventListenerOrEventListenerObject = this.click.bind(this);
    dom: HTMLElement
    click(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (e.which !== 1) return;
        const {node, builder} = this.context;
        const {setNodeState } = builder;
        setNodeState("active", node.id);
    }

    componentDidMount() {
        this.dom = ReactDOM.findDOMNode(this) as HTMLElement;
        this.dom.addEventListener("mousedown", this.clickWrapper);
    }

    componentWillUnmount(){
        if ( this.dom ) this.dom.removeEventListener("mousedown", this.clickWrapper);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

ActiveHandler.contextType = NodeContext;