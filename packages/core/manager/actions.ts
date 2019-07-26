import { NodeId, Node, Nodes, NodeRef } from "../interfaces";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "../dnd/interfaces";
import { ROOT_NODE, ERROR_MOVE_INCOMING_PARENT, ERROR_MOVE_OUTGOING_PARENT, ERROR_MOVE_TO_DESCENDANT, ERROR_MOVE_NONCANVAS_CHILD, ERROR_MOVE_TO_NONCANVAS_PARENT, ERROR_INVALID_NODEID, ERROR_MISSING_PLACEHOLDER_PLACEMENT } from "../utils/constants";
import { isCanvas, Canvas } from "../nodes";
import { QueryMethods } from "./query";
import { getDeepNodes } from "../utils/getDeepNodes";
const invariant = require('invariant');

type NodeToAdd = Node & {
  index?: number
}

const Actions = (state: ManagerState) => {
  return {
    setPlaceholder(placeholder: PlaceholderInfo) {
      if (placeholder && (!placeholder.placement.parent.ref.dom || (placeholder.placement.currentNode && !placeholder.placement.currentNode.ref.dom))) return;
      state.events.placeholder = placeholder;
    },
    setNodeEvent(eventType: "active" | "selected" | "hover" | "dragging", id: NodeId) {
      const current = state.events[eventType];
      if (current) {
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
        const parent = parentId ? parentId : node.data.closestParent || node.data.parent;        
        invariant((node.id !== ROOT_NODE && parent) || (node.id === ROOT_NODE && !parent), 'parentId is required when adding a node');
        
        // adding canvas to a normal node
        if ( parent ) {
          const parentNode = state.nodes[parent];
          if (isCanvas(node) && !isCanvas(parentNode)) {
            if (!parentNode.data._childCanvas) parentNode.data._childCanvas = {};
            node.data.closestParent = parentNode.id;
            parentNode.data._childCanvas[node.data.props.id] = node.id;
            delete node.data.props.id;
          } else {
            if (!parentNode.data.nodes) parentNode.data.nodes = []

            invariant(isCanvas(state.nodes[parent]), `Cannot add node to a non-Canvas node`)

            if (parent) {
              const currentNodes = state.nodes[parent].data.nodes;
              currentNodes.splice((node.index !== undefined) ? node.index : currentNodes.length - 1, 0, node.id);
              invariant(state.nodes[parent].ref.incoming(node), `Parent node rejects incoming node ${node}`);
              node.data.parent = node.data.closestParent = parent;
            }
          }
        }
        state.nodes[node.id] = node;
      });
    },
    move(targetId: NodeId, newParentId: NodeId, index: number) {
      const targetNode = state.nodes[targetId],
        newParent = state.nodes[newParentId],
        newParentNodes = newParent.data.nodes;

      // Define some rules
      invariant(isCanvas(newParent), ERROR_MOVE_TO_NONCANVAS_PARENT)
      invariant(targetNode.data.parent, ERROR_MOVE_NONCANVAS_CHILD);

      const currentParent = state.nodes[targetNode.data.parent],
            currentParentNodes = currentParent.data.nodes,
        currentTargetDeepNodes = getDeepNodes(state.nodes, targetId)

      invariant(!currentTargetDeepNodes.includes(newParent.id), ERROR_MOVE_TO_DESCENDANT);
      invariant(currentParent.ref.outgoing(targetNode), ERROR_MOVE_OUTGOING_PARENT)
      invariant(newParent.ref.incoming(targetNode), ERROR_MOVE_INCOMING_PARENT);

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
      newParentNodes.splice(index, 0, targetId);
      state.nodes[targetId].data.parent = newParentId;
      state.nodes[targetId].data.closestParent = newParentId;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

    },
    setProp(id: NodeId, cb: (props: any) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID)
      cb(state.nodes[id].data.props);
    },
    setRef(id: NodeId, cb: (ref: NodeRef) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID)
      cb(state.nodes[id].ref as NodeRef);
    },
  }
};

export default Actions;