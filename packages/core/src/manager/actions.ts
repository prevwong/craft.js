import { NodeId, Node, Nodes, NodeRef, NodeToAdd } from "../interfaces";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "../dnd/interfaces";
import { ERROR_INVALID_NODEID, ERROR_ROOT_CANVAS_NO_ID } from "craftjs-utils";
import { isCanvas } from "../nodes";
import { QueryMethods } from "./query";
import { QueryCallbacksFor } from "craftjs-utils";
const invariant = require('invariant');


const Actions = (state: ManagerState, query: QueryCallbacksFor<typeof QueryMethods>) => {
  // console.log("actions", state, q)
  return {
    
    setPlaceholder(placeholder: PlaceholderInfo) {
      if (placeholder && (!placeholder.placement.parent.ref.dom || (placeholder.placement.currentNode && !placeholder.placement.currentNode.ref.dom))) return;
      state.events.placeholder = placeholder;
    },
    setNodeEvent(eventType: "active" | "hover" | "dragging" | "pending", id: NodeId) {
      const current = state.events[eventType];
      if (current && id != current.id) {
        state.nodes[current.id].event[eventType] = false;
      }

      if (id) {
        state.nodes[id].event[eventType] = true
        state.events[eventType] = state.nodes[id];
      } else {
        // if ( eventType === 'dragging') return;
        state.events[eventType] = null;
      }
    },
    replaceNodes(nodes: Nodes) {
      state.nodes = nodes;
    },
    add(nodes: NodeToAdd[] | NodeToAdd, parentId?: NodeId ) {
      if (!Array.isArray(nodes)) nodes = [nodes];
      (nodes as NodeToAdd[]).forEach(node => {
        const parent = parentId ? parentId : node.data.closestParent || node.data.parent,
              parentNode = state.nodes[parent];   
        
        if (parentNode && isCanvas(node) && !isCanvas(parentNode) ) {
          invariant(node.data.props.id, ERROR_ROOT_CANVAS_NO_ID);
          if (!parentNode.data._childCanvas) parentNode.data._childCanvas = {};
          node.data.closestParent = parentNode.id;
          parentNode.data._childCanvas[node.data.props.id] = node.id;
          delete node.data.props.id;
        } else {
          if ( parentId) query.canDropInParent(node, parentId);
          if (parentNode ) {
            if (!parentNode.data.nodes) parentNode.data.nodes = [];
            const currentNodes = parentNode.data.nodes;
            currentNodes.splice((node.index !== undefined) ? node.index : currentNodes.length, 0, node.id);
            node.data.parent = node.data.closestParent = parent;
          } 
        }        
        state.nodes[node.id] = node;
      });
    },
    setPending(node: Node) {
      state.events.pending = node;
    },
    move(targetId: NodeId, newParentId: NodeId, index: number) {
      const targetNode = state.nodes[targetId],
        newParent = state.nodes[newParentId],
        newParentNodes = newParent.data.nodes;

      // Define some rules
      query.canDropInParent(targetNode, newParentId);

      const currentParent = state.nodes[targetNode.data.parent],
            currentParentNodes = currentParent.data.nodes;

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
      if ( newParentNodes ) 
        newParentNodes.splice(index, 0, targetId);
      else 
        newParent.data.nodes = [targetId];
        
      state.nodes[targetId].data.parent = newParentId;
      state.nodes[targetId].data.closestParent = newParentId;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

    },
    setProp(id: NodeId, cb: (props: any) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID);
      cb(state.nodes[id].data.props);
      if (state.events['active'] && state.events['active'].id == id) state.events['active'] = state.nodes[id]
    },
    setRef(id: NodeId, cb: (ref: NodeRef) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID)
      cb(state.nodes[id].ref as NodeRef);
        // if ( state.events.active && state.events.active.id == id ) {
        //     state.events.active = state.nodes[id]
        // }
    }

  }
};

export default Actions;
