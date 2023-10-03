import React from 'react';

import { RenderEditorIndicator } from './RenderEditorIndicator';

type EventsProps = {
  children?: React.ReactNode;
};

export const Events: React.FC<EventsProps> = ({ children }) => {
  return (
    <>
      <RenderEditorIndicator />
      {children}
    </>
  );
};
