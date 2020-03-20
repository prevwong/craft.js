import { createContext, useContext } from "react";
import { EditorHandlers } from "./EditorHandlers";

export type EventHandlerContext = EditorHandlers;
export const EventHandlerContext = createContext<EventHandlerContext>(null);

export const useEventHandler = () => {
  return useContext(EventHandlerContext);
};
