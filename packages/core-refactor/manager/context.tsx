import React from "react";
import useMethods from "use-methods";

export const ManagerContext = React.createContext<any>(null);

const reducers = state => ({
  add(parentId, nodes) {
    if (parentId && !state.nodes[parentId].nodes) state.nodes[parentId].nodes = []

    if (Array.isArray(nodes)) {
      (nodes as Node[]).forEach(node => {
        state.nodes[node.id] = node;
        if (parentId) state.nodes[parentId].nodes.push(node.id);
      });
    } else {
      const node = nodes as Node;
      state.nodes[node.id] = node;
      if (parentId) state.nodes[parentId].nodes.push(node.id);
    }
  },
  move(targetId, newParentId, index) {
    const targetNode = state.nodes[targetId],
      currentParentNodes = (state.nodes[targetNode.parent] as CanvasNode).nodes,
      newParentNodes = (state.nodes[newParentId] as CanvasNode).nodes;

    currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    newParentNodes.splice(index, 0, targetId);
    state.nodes[targetId].parent = newParentId;
    state.nodes[targetId].closestParent = newParentId;
    currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
  },
  pushChildCanvas(id, canvasName, newNode) {
    if (!state.nodes[id].childCanvas) state.nodes[id].childCanvas = {};
    state.nodes[id].childCanvas[canvasName] = newNode.id;
    state.nodes[newNode.id] = newNode;
  },
  setNodeEvent(eventType, id) {
    if (!["active", "hover", "dragging"].includes(eventType)) throw new Error(`Undefined event "${eventType}, expected either "active", "hover" or "dragging".`);
    if (id) {
      state.events[eventType] = id;
    } else {
      state.events[eventType] = null;
    }
  }
});

export const ManagerContextProvider = ({ children, nodes: defaultNodes }: any) => {
  const [
    state, // <- latest state
    methods, // <- callbacks for modifying state
  ] = useMethods(reducers, { nodes: defaultNodes ? defaultNodes : {}, events: {} });
  (window as any).nodes = state.nodes
  return (
    <ManagerContext.Provider value={{ state, methods }}>
      {children}
    </ManagerContext.Provider>
  )
}


