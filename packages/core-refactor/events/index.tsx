import React, { useState, useEffect, useContext } from "react";
import { connectManager } from "../manager";

export const EventsManager = connectManager(({children, manager: [state, methods]}) => {
  const [placeholder, setPlaceholder] = useState(null);

  useEffect(() => {
    if (state.events.active) {
      const onDrag = (e: React.MouseEvent) => {
        const { left, right, top, bottom } = info[state.events.active]
        if (
          !(
            e.clientX >= right &&
            e.clientY >= top &&
            e.clientY <= bottom
          )
        ) {
          // Element being dragged
          console.log("Dragging");
        }
      }
      window.addEventListener("mousemove", onDrag);
    }
  }, [state.events.active]);

  useEffect(() => {
    window.addEventListener("mousedown", () => {
      methods.setNodeEvent("active", null);
    })
  }, []);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
})