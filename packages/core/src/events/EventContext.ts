import { createContext, useContext } from 'react';
import { EventHandlers } from './EventHandlers';

export const EventHandlerContext = createContext<EventHandlers>(null);

export const useEventHandler = () => useContext(EventHandlerContext);
