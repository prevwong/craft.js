import React, { useReducer } from "react";
import produce from "immer";
import { Node, CanvasNode } from "~types";

export const CraftContext = React.createContext<any>(null);

const reducer = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case "add":
        const { parentId, nodes } = action;
        if ((nodes as Node[]).length) {
          (nodes as Node[]).forEach(node => draft.nodes[node.id] = node);
          
        } else {
          const node = nodes as Node;
          draft.nodes[node.id] = node;
        }

        break;
      case "move":
        const { targetId, newParentId, index } = action;

        const targetNode = draft.nodes[targetId],
          currentParentNodes = (draft.nodes[targetNode.parent] as CanvasNode).nodes,
          newParentNodes = (draft.nodes[newParentId] as CanvasNode).nodes;

        currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
        newParentNodes.splice(index, 0, targetId);
        draft.nodes[targetId].parent = newParentId;
        draft.nodes[targetId].closestParent = newParentId;
        currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
        break;

      case "pushChildCanvas":
          if (!draft.nodes[action.id].childCanvas) draft.nodes[action.id].childCanvas = {};
          draft.nodes[action.id].childCanvas[action.canvasName] = action.canvasId;
          break;
    }
  })


export const CraftContextProvider = ({ children, nodes}) => {
  const [craft, dispatch] = useReducer(reducer, );
} 