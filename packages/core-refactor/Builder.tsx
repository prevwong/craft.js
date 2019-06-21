import React from "react";
import produce from "immer";
import { CanvasNode, Nodes, NodeId, Node } from "~types";
import { NodeManagerContext } from "./nodes/NodeManagerContext";
import EventManager from "./events/EventManager";
import EventContext from "./events/EventContext";
import { createAPIContext, CraftAPIContext } from "./CraftAPIContext";

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

      newParentNodes.splice(index, 0, targetId);
      nodes[targetId].parent = newParentId;
      nodes[targetId].closestParent = newParentId;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    });
  }

  setNodes = (cb: Function) => {
    this.setState((state) => {
      state.nodes =  produce(this.state.nodes, cb);
      return state;
    });
  }

  render(){
    const { state, setNodes, add, move } = this,
          { nodes } = state;
    
    return (
      <NodeManagerContext.Provider value={{nodes, setNodes, add, move}}>
        <EventManager>
          <EventContext.Consumer>
            {({active, dragging, hover, setNodeEvent}) => {
              return (
                <CraftAPIContext.Provider value={createAPIContext(
                  {active, dragging, hover},
                  nodes,
                  {
                    add,
                    move,
                    setActiveNode: (nodeId: NodeId) => setNodeEvent("active", nodeId),
                    delete: () => {}
                  }
                )}>
                  {this.props.children}
                </CraftAPIContext.Provider>
              )
            }}
          </EventContext.Consumer>
        </EventManager>
      </NodeManagerContext.Provider>
    )
  }
}