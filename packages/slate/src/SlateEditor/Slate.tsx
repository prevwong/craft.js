import React, { useState } from 'react';
import { Slate as SlateEditor } from 'slate-react';

import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { CraftStateSync } from './CraftStateSync';

export const Slate: React.FC<any> = ({ children, editor }) => {
  const [value, setValue] = useState([]);

  return (
    <SlateEditor editor={editor} value={value} onChange={setValue}>
      <CraftStateSync onChange={setValue} />
      <SlateNodeContextProvider>{children}</SlateNodeContextProvider>
    </SlateEditor>
  );
};
