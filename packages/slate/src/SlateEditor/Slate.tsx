import React from 'react';

import { SlateNodeContextProvider } from './SlateNodeContext';

export const Slate: React.FC<any> = ({ children, editor, enabled }) => {
  return (
    <SlateNodeContextProvider editor={editor} enabled={enabled}>
      {children}
    </SlateNodeContextProvider>
  );
};
