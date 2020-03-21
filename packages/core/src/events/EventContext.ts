import { createContext, useContext } from "react";
import { EventHandlers } from "./EventHandlers";

export type EventHandlerContext = EventHandlers;
export const EventHandlerContext = createContext<EventHandlerContext>(null);

export const useEventHandler = () => {
  return useContext(EventHandlerContext);
};
