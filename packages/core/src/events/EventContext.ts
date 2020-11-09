import { createContext, useContext } from 'react';

import { CoreEventHandlers } from './CoreEventHandlers';

export const EventHandlerContext = createContext<CoreEventHandlers>(null);

export const useEventHandler = () => useContext(EventHandlerContext);
