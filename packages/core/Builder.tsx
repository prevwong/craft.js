import React from "react";
import NodeElement from "./nodes/NodeElement";
import { Node,  NodeId, BuilderContextState, PlaceholderInfo, BuilderState, Nodes, CanvasNode } from "~types";
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
    // if ( id && !this.state.nodes[id] ) throw new Error(`Node ${id} not found.`);
    this.setState({
      [state]: typeof id === "object" ? id : this.state.nodes[id]
    })
  }


  add = (newNodes: Node | Node[]) => {
    this.setImmer((nodes: Nodes) => {
      if ((newNodes as Node[]).length) {
        (newNodes as Node[]).forEach(node => nodes[node.id] = node);
      } else {
        const node = newNodes as Node;
        nodes[node.id] = node;
      }
    })
  }

  move = (targetId: NodeId, newParentId: NodeId, index: number) => {
    this.setImmer((nodes: Nodes) => {
      const targetNode = nodes[targetId],
            currentParentNodes = (nodes[targetNode.parent] as CanvasNode).nodes,
            newParentNodes = (nodes[newParentId] as CanvasNode).nodes;

      newParentNodes.splice(index, 0, targetId);
      nodes[targetId].parent = newParentId;
      nodes[targetId].closestParent = newParentId;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    });
  }

  setImmer(cb: Function) {
    const newNodes = produce(this.state.nodes, cb);
    
    this.setState({
      nodes: newNodes
    });
  } 

  render() {
    const { setNodeState, setImmer, add, move } = this;
    (window as any).tree = this.state.nodes;

    return (
      <BuilderContext.Provider value={{
        ...this.state,
        add,
        move,
        nodesInfo: this.nodesInfo,
        // setNodes,
        setNodeState,
        setImmer: setImmer.bind(this)
      }}>
        <DragDropManager>
          {this.props.children}
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}