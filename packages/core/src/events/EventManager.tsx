import React, { useMemo } from "react";
import movePlaceholder from "./movePlaceholder";
import { EditorHandlers } from "./EditorHandlers";

import { getDOMInfo, RenderIndicator } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { EventContext } from "./EventContext";

export const EventManager: React.FC = ({ children }) => {
  const { events, indicator, store } = useInternalEditor(state => ({
    events: state.events,
    indicator: state.options.indicator
  }));

  const connectors = useMemo(() => EditorHandlers.create(store), [store]);

  return (
    <EventContext.Provider value={connectors}>
      {events.indicator
        ? React.createElement(RenderIndicator, {
            style: {
              ...movePlaceholder(
                events.indicator.placement,
                getDOMInfo(events.indicator.placement.parent.dom),
                events.indicator.placement.currentNode
                  ? getDOMInfo(events.indicator.placement.currentNode.dom)
                  : null
              ),
              backgroundColor: events.indicator.error
                ? indicator.error
                : indicator.success,
              transition: "0.2s ease-in"
            }
          })
        : null}
      {children}
    </EventContext.Provider>
  );
};
