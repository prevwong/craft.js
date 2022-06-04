import React, { useContext, useMemo } from 'react';

import { EventHandlerContext } from './EventContext';
import { RenderEditorIndicator } from './RenderEditorIndicator';

import { EditorContext } from '../editor/EditorContext';

type EventsProps = {
  children?: React.ReactNode;
};

export const Events: React.FC<EventsProps> = ({ children }) => {
  const store = useContext(EditorContext);

  const handler = useMemo(() => store.query.getOptions().handlers(store), [
    store,
  ]);

  if (!handler) {
    return null;
  }

  return (
    <EventHandlerContext.Provider value={handler}>
      <RenderEditorIndicator />
      {children}
    </EventHandlerContext.Provider>
  );
};
