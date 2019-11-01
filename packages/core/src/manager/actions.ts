import { NodeId, Node, Nodes, NodeRef } from "../interfaces";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "../dnd/interfaces";
import { ERROR_INVALID_NODEID, ERROR_ROOT_CANVAS_NO_ID } from "craftjs-utils";
import { isCanvas } from "../nodes";
import { QueryMethods } from "./query";
import { QueryCallbacksFor } from "craftjs-utils";
import { updateEventsNode } from "../utils/updateEventsNode";
const invariant = require('invariant');


const Actions = (state: ManagerState, query: QueryCallbacksFor<typeof QueryMethods>) => {
  // console.log("actions", state, q)
  return {
    
    setPlaceholder(placeholder: PlaceholderInfo) {
      if (placeholder && (!placeholder.placement.parent.ref.dom || (placeholder.placement.currentNode && !placeholder.placement.currentNode.ref.dom))) return;
      state.events.placeholder = placeholder;
    },
    setNodeEvent(eventType: "active" | "hover" | "dragging", id: NodeId) {
      const current = state.events[eventType];
      if (current && id != current.id) {
        state.nodes[current.id].event[eventType] = false;
      }

      if (id) {
        const node = state.nodes[id];
        state.nodes[id].event[eventType] = true
        state.events[eventType] = node;
      } else {
        state.events[eventType] = null;
      }
    },
    replaceNodes(nodes: Nodes) {
      state.nodes = nodes;
    },
    add(nodes: Node[] | Node, parentId?: NodeId ) {
      if (!Array.isArray(nodes)) nodes = [nodes];
      if (parentId && !state.nodes[parentId].data.nodes && isCanvas(state.nodes[parentId])) state.nodes[parentId].data.nodes = [];

      (nodes as Node[]).forEach(node => {
        const parent = parentId ? parentId :  node.data.parent,
              parentNode = state.nodes[parent];   
        
        if (parentNode && isCanvas(node) && !isCanvas(parentNode) ) {
          invariant(node.data.props.id, ERROR_ROOT_CANVAS_NO_ID);
          if (!parentNode.data._childCanvas) parentNode.data._childCanvas = {};
          node.data.parent = parentNode.id;
          parentNode.data._childCanvas[node.data.props.id] = node.id;
          delete node.data.props.id;
        } else {
          if ( parentId) query.canDropInParent(node, parentId);
          if (parentNode ) {
            // if (parentId && !state.nodes[parentId].data.nodes) state.nodes[parentId].data.nodes = [];
            if (!parentNode.data.nodes) parentNode.data.nodes = [];
            const currentNodes = parentNode.data.nodes;
            currentNodes.splice((node.data.index !== undefined) ? node.data.index : currentNodes.length, 0, node.id);
            node.data.parent =  parent;
          } 
        }        
        state.nodes[node.id] = node;
      });

     
    },
    move(targetId: NodeId, newParentId: NodeId, index: number) {
      const targetNode = state.nodes[targetId],
        newParent = state.nodes[newParentId],
        newParentNodes = newParent.data.nodes;

      query.canDropInParent(targetNode, newParentId);

      const currentParent = state.nodes[targetNode.data.parent],
            currentParentNodes = currentParent.data.nodes;

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";

      if ( newParentNodes ) 
        newParentNodes.splice(index, 0, targetId);
      else 
        newParent.data.nodes = [targetId];
        
      state.nodes[targetId].data.parent = newParentId;
      state.nodes[targetId].data.index = index;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

      // updateEventsNode(state, targetId);

    },
    setProp(id: NodeId, cb: (props: any) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID);
      cb(state.nodes[id].data.props);
      updateEventsNode(state, id);
    },
    setRef(id: NodeId, cb: (ref: NodeRef) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID)
      cb(state.nodes[id].ref as NodeRef);
      // updateEventsNode(state, id);
    }

  }
};

export default Actions;
