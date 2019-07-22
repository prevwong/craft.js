import { NodeId, Node, Nodes, NodeRef } from "../interfaces";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "../dnd/interfaces";
const invariant = require('invariant');

const ManagerMethods = (state: ManagerState) => ({
  pushChildCanvas(id: NodeId, canvasName: string, newNode: Node) {
    const targetNode = state.nodes[id]
    if (!targetNode.data._childCanvas) targetNode.data._childCanvas = {};
    newNode.data.closestParent = id;
    targetNode.data._childCanvas[canvasName] = newNode.id;
    state.nodes[newNode.id] = newNode;
  },
  setPlaceholder(placeholder: PlaceholderInfo) {
    if ( placeholder && (!placeholder.placement.parent.ref.dom || (placeholder.placement.currentNode  && !placeholder.placement.currentNode .ref.dom))) return;
    state.events.placeholder = placeholder;
  },
  setNodeEvent(eventType: "active" | "selected" | "hover" | "dragging", id: NodeId) {
    const current = state.events[eventType];
    if (current ) {
      state.nodes[current.id].ref.event[eventType] = false;
    }

    if (id) {
      state.nodes[id].ref.event[eventType] = true
      state.events[eventType] = state.nodes[id];
    } else {
      // if ( eventType === 'dragging') return;
      state.events[eventType] = null;
    }
  },
  replaceNodes(nodes: Nodes) {
    state.nodes = nodes;
  },
  add(parentId: NodeId, nodes: Node[] | Node) {
    if (parentId && !state.nodes[parentId].data.nodes) state.nodes[parentId].data.nodes = []
    if (!Array.isArray(nodes)) nodes = [nodes];
    (nodes as Node[]).forEach(node => {
      if ( parentId ) {
        state.nodes[parentId].data.nodes.push(node.id);
        invariant(state.nodes[parentId].ref.incoming(node), `Parent node rejects incoming node ${node}`);
      }
      state.nodes[node.id] = node;
    });
  },
  move(targetId: NodeId, newParentId: NodeId, index: number) {
    const targetNode = state.nodes[targetId],
      currentParent = state.nodes[targetNode.data.parent],
      currentParentNodes = currentParent.data.nodes,
      newParent = state.nodes[newParentId],
      newParentNodes = newParent.data.nodes;

    // Define some rules
    invariant(targetNode.data.parent, `Cannot move node that is not a direct-descendant of a Canvas ${targetNode}`)
    invariant(currentParent.ref.outgoing(targetNode), `Node cannot be dragged out of parent ${targetNode}`)
    invariant(newParent.ref.incoming(targetNode), `Target parent rejects incoming node ${targetNode}`);

    currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    newParentNodes.splice(index, 0, targetId);
    state.nodes[targetId].data.parent = newParentId;
    state.nodes[targetId].data.closestParent = newParentId;
    currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
    
  },
  setProp(id: NodeId, cb: <T>(props: T) => void) {
    cb(state.nodes[id].data.props);
  },
  setRef(id: NodeId, ref: keyof NodeRef, value: any) {
    state.nodes[id].ref[ref] = value;
  },
});

export default ManagerMethods;