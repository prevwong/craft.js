import { NodeId, Node, Nodes, Options } from "../interfaces";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "../events/interfaces";
import { ERROR_INVALID_NODEID, ERROR_ROOT_CANVAS_NO_ID, ROOT_NODE, CallbacksFor } from "craftjs-utils";
import { isCanvas, isTopLevelCanvas } from "../nodes";
import { QueryMethods } from "./query";
import { QueryCallbacksFor } from "craftjs-utils";
import { updateEventsNode } from "../utils/updateEventsNode";
import { debounce } from "lodash"

const invariant = require('invariant');


const Actions = (state: ManagerState, query: QueryCallbacksFor<typeof QueryMethods>) => {
  const _ = <T extends keyof CallbacksFor<typeof Actions>>(name: T) => Actions(state, query)[name];
  return {
    setOptions(options: Options) {
      state.options = {
        ...state.options,
        ...options,
      };
    },
    setPlaceholder(placeholder: PlaceholderInfo) {
      if (placeholder && (!placeholder.placement.parent.dom || (placeholder.placement.currentNode && !placeholder.placement.currentNode.dom))) return;
      state.events.placeholder = placeholder;
    },
    setNodeEvent(eventType: "active" | "hover" | "dragging", id: NodeId) {
      const current = state.events[eventType];
      if (current && id != current) {
        state.nodes[current].event[eventType] = false;
      }

      if (id) {
        const node = state.nodes[id];
        state.nodes[id].event[eventType] = true
        state.events[eventType] = id;
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
            if ( parentNode.data.props.children ) delete parentNode.data.props["children"];
            
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
    delete(id: NodeId) {
      invariant(id != ROOT_NODE, "Cannot delete Root node");
      const targetNode = state.nodes[id];
      if (isCanvas(targetNode)) {
        invariant(isTopLevelCanvas(targetNode), "Cannot delete a Canvas that is not a direct child of another Canvas");
        targetNode.data.nodes.map((childId) => {
          _("delete")(childId);
        })
      }

      const parentNode = state.nodes[targetNode.data.parent];
      if (parentNode && parentNode.data.nodes.indexOf(id) > -1) {
        parentNode.data.nodes.splice(parentNode.data.nodes.indexOf(id), 1);
      }
      updateEventsNode(state, id, true);
      delete state.nodes[id];
    },
    setProp(id: NodeId, cb: (props: any) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID);
      cb(state.nodes[id].data.props);
      // updateEventsNode(state, id);
    },
    setDOM(id: NodeId, dom: HTMLElement) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID)
      state.nodes[id].dom = dom;
      // updateEventsNode(state, id);
    },
    setHidden(id: NodeId, bool: boolean) {
      state.nodes[id].hidden = bool;
    }
  }
};

export default Actions;
