import { createContext } from "react";

export type EventContext = any;
export const EventContext = createContext<EventContext>(null);