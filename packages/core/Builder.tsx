import React from "react";
import NodeElement from "./nodes/NodeElement";
import { Node,  NodeId, BuilderContextState, BuilderState, Nodes, CanvasNode } from "~types";
import DragDropManager from "./dnd";
import BuilderContext from "./BuilderContext";
import RenderNodeWithContext from "./render/RenderNodeWithContext";
import { makePropsReactive, mapChildrenToNodes, nodesToTree, getDeepChildrenNodes } from "./utils";
import produce from "immer";
import DNDContext from "./dnd/DNDContext";

export const NodeMouseEventContext = React.createContext<any>({});
export const CraftAPI = React.createContext<any>();

export default class Builder extends React.Component<any> {
  nodesInfo = {};
  state: BuilderState = {
    nodes: produce({}, (draft) => {}),
  }
  constructor(props: any) {
      super(props);
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

  setImmer = (cb: Function)  => {
    const newNodes = produce(this.state.nodes, cb);
    this.setState((state) => {
      state.nodes =  produce(this.state.nodes, cb);
      return state;
    });
  } 

  render() {
    const { setImmer, add, move } = this;
    (window as any).tree = this.state.nodes;
    const { nodes} = this.state;

    return (
      <BuilderContext.Provider value={{
        nodes,
        add,
        move,
        setImmer
      }}>
        <DragDropManager>
          <DNDContext.Consumer>
            {({active, dragging, hover, setActive}) => {
              return (
                <CraftAPI.Provider value={{nodes, add, move, active, dragging, hover, setActive}}>
                  {this.props.children}
                </CraftAPI.Provider>
              )
            }}
          </DNDContext.Consumer>
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}
