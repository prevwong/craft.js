import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Node, Nodes, CanvasNode, NodeId, BuilderContextState, PlaceholderInfo } from "~types";
import DragDropManager from "./DragDropManager";
import { createNode, mapChildrenToNodes } from "../Canvas/helpers";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";
import { loadState } from "./helpers";
import test from "./test";
import BuilderContext from "./BuilderContext";

export default class Builder extends React.Component<any> {
  state: BuilderContextState = {
    nodes: {},
    active: null,
    dragging: null,
    placeholder: null,
    setCanvasNodes: (canvasId: string, nodes: Node[]) => {
      this.state.nodes = {
        ...this.state.nodes,
        ...nodes
      } as Nodes
    },
    setActive: (id: NodeId) => {
      this.setState({
        active: this.state.nodes[id]
      });
    },
    setDragging: (id: NodeId) => {
      this.setState({
        dragging: id ? this.state.nodes[id] : null
      });
    },
    setPlaceholder: (placeholder: PlaceholderInfo) => {
      this.setState({
        placeholder
      });
    }
  }
  componentWillMount() {
    (window as any).tree = this.state;
    (window as any).save = this.saveState.bind(this);
    let rootNode = mapChildrenToNodes(<div id="root-node">{this.props.children}</div>, null, "rootNode");
    const loadedStateJSON: any = test
    // console.log(66, loadedStateJSON)
    if (loadedStateJSON) {
      const loadedState = loadState(JSON.stringify(loadedStateJSON), this.props.components)
      // rootNode = loadedState;
    }



    this.state.setCanvasNodes(false, rootNode);
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
  render() {
    const { nodes } = this.state;
    return (
      <BuilderContext.Provider value={this.state}>
        <DragDropManager>
          <RenderDraggableNode nodeId="rootNode" />
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}