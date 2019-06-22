import React from "react";
import produce from "immer";
import { CanvasNode, Nodes, NodeId, Node } from "~types";
import { NodeManagerContext } from "./nodes/NodeManagerContext";
import EventManager from "./events/EventManager";
import EventContext from "./events/EventContext";
import { createAPIContext, CraftAPIContext } from "./CraftAPIContext";
import Root from "./Root";

interface BuilderState {
  nodes: Nodes
}

export default class Builder extends React.Component {
  state: BuilderState = {
    nodes: produce({}, () => {})
  }

  add = (newNodes: Node | Node[]) => {
    this.setNodes((nodes: Nodes) => {
      if ((newNodes as Node[]).length) {
        (newNodes as Node[]).forEach(node => nodes[node.id] = node);
      } else {
        const node = newNodes as Node;
        nodes[node.id] = node;
      }
    })
  }

  move = (targetId: NodeId, newParentId: NodeId, index: number) => {
    this.setNodes((nodes: Nodes) => {
      const targetNode = nodes[targetId],
            currentParentNodes = (nodes[targetNode.parent] as CanvasNode).nodes,
            newParentNodes = (nodes[newParentId] as CanvasNode).nodes;

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
      newParentNodes.splice(index, 0, targetId);
      nodes[targetId].parent = newParentId;
      nodes[targetId].closestParent = newParentId;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
    });
  }

  remove = () => {

  }

  setNodes = (cb: Function) => {
    console.log("set NODES")
    this.setState((state) => {
      state.nodes =  produce(this.state.nodes, cb);
      return state;
    });
  }


  render(){
    const { state, setNodes, add, remove, move } = this,
          { nodes } = state;
   
    return (
      <NodeManagerContext.Provider value={{
        nodes,
        methods: {
          remove, 
          setNodes, 
          add, 
          move
        }
      }}>
        <EventManager>
          <Root>{this.props.children}</Root>
        </EventManager>
      </NodeManagerContext.Provider>
    )
  }
}