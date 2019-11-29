import React from "react";
import ReactDOM from "react-dom";
import { useManager } from "craftjs";

export const ComponentHighlighter = () => {
  const { activeDOM } = useManager((state) => {
    const nodeId = state.events.active;
    return {
      activeDOM: nodeId && state.nodes[nodeId] && state.nodes[nodeId].dom
    }
  });

  console.log("a", activeDOM)
  return activeDOM ? ReactDOM.createPortal(
    <div className='pointer-events-none absolte top-0 left-0 border-dashed border z-50 border-black w-full h-full' />,
    activeDOM
  ) : null
}