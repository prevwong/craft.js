import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Nodes, Node, NodeId } from "../interfaces";
import { PlaceholderInfo } from "./interfaces";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import {RenderPlaceholder} from "../render/RenderPlaceholder";
import {useManager} from "../manager";
import { getDOMInfo } from "./getDOMInfo";
import { MonitorContext } from "../monitor";

export const DNDManager: React.FC = ({ children }) => {
  const { nodes, events, move, query } = useManager((state) => state)
  const [subscribeMonitor, getMonitor, { setNodeEvent }] = useContext(MonitorContext);
  const [placeholder, setPlaceholder] = useState<PlaceholderInfo>(null);
  const [isMousePressed, setMousePressed] = useState(false);
  
  const nodesRef = useRef(null);
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    subscribeMonitor(() => {
      const { prev, current } = getMonitor();
      if (prev.events.active !== current.events.active) {
        console.log("set active", current.events.active)
        setActive(current.events.active);
      } else if (prev.events.dragging !== current.events.dragging) {
        setDragging(current.events.dragging);
      }
      nodesRef.current = current.nodes;
    })
  }, [])
return (
  <React.Fragment>
    {
      placeholder? <RenderPlaceholder placeholder = { placeholder } /> : null
    }
    {children}
  </React.Fragment>
)
}