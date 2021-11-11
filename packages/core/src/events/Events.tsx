import React from 'react';

import { RenderEditorIndicator } from './RenderEditorIndicator';

export const Events: React.FC = ({ children }) => {
  return (
    <>
      <RenderEditorIndicator />
      {children}
    </>
  );
};
