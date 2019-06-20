import React from "react";
import NodeElement from "./nodes/NodeElement";
import { Node,  NodeId, BuilderContextState, PlaceholderInfo, BuilderState, Nodes } from "~types";
import DragDropManager from "./dnd";
import BuilderContext from "./BuilderContext";
import RenderNodeWithContext from "./render/RenderNodeWithContext";
import { makePropsReactive, mapChildrenToNodes, nodesToTree, getDeepChildrenNodes } from "./utils";
import produce from "immer";

export default class Builder extends React.Component<any> {
  nodesInfo = {};
  state: BuilderState = {
    nodes: produce({}, (draft) => {}),
    hover:null,
    active: null,
    dragging: null,
    placeholder: null,
  }
  constructor(props: any) {
      super(props);
  }
  setNodeState = (state: string, id: NodeId) => {
    if ( !["active", "hover", "dragging"].includes(state) ) throw new Error(`Undefined state "${state}, expected either "active", "hover" or "dragging".`);
    if ( id && !this.state.nodes[id] ) throw new Error(`Node ${id} not found.`);
    this.setState({
      [state]: this.state.nodes[id]
    })
  }

  setPlaceholder = (placeholder: PlaceholderInfo) => {
    this.setState({
      placeholder
    });
  }

  setImmer(cb: Function) {
    const newNodes = produce(this.state.nodes, cb);

    this.setState({
      nodes: newNodes
    })

    window.t = newNodes;
    // console.log(this.state.nodes, newNodes);
  } 

  componentDidMount() {
    // window.addEventListener("mouseover", e => {
    //   if ( this.state.hover ) this.setNodeState("hover", null);
    // });
    // window.addEventListener("mousedown", e => {
    //   if ( this.state.active) this.setNodeState("active", null);
    // })
  }
  render() {
    const { setNodeState, setImmer, setPlaceholder } = this;
    (window as any).tree = this.state.nodes;

    return (
      <BuilderContext.Provider value={{
        ...this.state,
        nodesInfo: this.nodesInfo,
        // setNodes,
        setNodeState,
        setPlaceholder,
        setImmer: setImmer.bind(this)
      }}>
        <DragDropManager>
          {this.props.children}
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}