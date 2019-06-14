import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Node, Nodes, CanvasNode, NodeId, BuilderContextState, PlaceholderInfo, BuilderState } from "~types";
import DragDropManager from "./DragDropManager";
import { createNode, mapChildrenToNodes } from "../Canvas/helpers";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";
import { loadState } from "./helpers";
import test from "./test";
import BuilderContext from "./BuilderContext";
import RenderNodeWithContext from "../Nodes/RenderNodeWithContext";

export default class Builder extends React.Component<any> {
  nodesInfo = {};
  state: BuilderState = {
    nodes: {},
    nodeStates: {},
    hover:null,
    active: null,
    dragging: null,
    placeholder: null,
  }
  constructor(props: any) {
    super(props);
    (window as any).tree = this.state;
    (window as any).save = this.saveState.bind(this);
    let rootNode = mapChildrenToNodes(<div id="root-node">{this.props.children}</div>, null, "rootNode");
    // const loadedStateJSON: any = test
    // // console.log(66, loadedStateJSON)
    // if (loadedStateJSON) {
    //   const loadedState = loadState(JSON.stringify(loadedStateJSON), this.props.components)
    //   // rootNode = loadedState;
    // }
    this.state.nodes = {
      ...rootNode
    }
  }

  setNodes = (nodes: Function) => {
    this.setState((draft: BuilderContextState) => {
      const fn = nodes(draft.nodes);
      draft.nodes = fn;
      return draft;
    });
  }

  setActive = (id: NodeId) => {
   
    this.setState({
      active: this.state.nodes[id]
    });
  }

  setDragging = (id: NodeId) => {
    this.setState({
      dragging: id ? this.state.nodes[id] : null
    });
  }

  setHover = (id: NodeId) => {
    this.setState({
      hover: id ? this.state.nodes[id] : null
    });
  }

  setPlaceholder = (placeholder: PlaceholderInfo) => {
    this.setState({
      placeholder
    });
  }

  saveState() {
    return Object.keys(this.state.nodes).reduce((result: any, nodeId) => {
      const node: Node = { ...this.state.nodes[nodeId] };
      node.type = typeof node.type === "function" ? node.type.name : node.type;

      const JSXToNode = ((children: React.ReactNode) => {
        return React.Children.toArray(children).map((child: React.ReactElement, i) => {
          if (typeof child === "string") return child;
          const { type, props } = child;
          const { children, ...otherProps } = props;
          if (children) {
            otherProps.children = JSXToNode(children);
          }
          return {
            type: typeof type === "function" ? type.name : type,
            props: otherProps
          }
        })
      });

      if (node.props.children) {
        const { children, ...otherProps } = node.props;
        delete node.props;
        node.props = {
          ...otherProps,
          children: JSXToNode(React.Children.toArray(children))
        }
      }

      result[node.id] = node;
      return result;
    }, {});
  }


  componentDidMount() {
    window.addEventListener("mouseover", e => {
      if ( this.state.hover ) this.setHover(null);
    });
    window.addEventListener("mousedown", e => {
      if ( this.state.active) this.setActive(null);
    })
  }
  render() {
    const { setNodes, setActive, setHover, setDragging, setPlaceholder } = this;
    (window as any).tree = this.state;
    return (
      <BuilderContext.Provider value={{
        ...this.state,
        nodesInfo: this.nodesInfo,
        setNodes,
        setActive,
        setDragging,
        setHover,
        setPlaceholder
      }}>
        <DragDropManager>
          <NodeElement node={this.state.nodes["rootNode"]}>
            <RenderNodeWithContext />
          </NodeElement>
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}