import React, { useState } from 'react';
import { Slate as SlateEditor } from 'slate-react';

import { Editable } from './Editable';

import { SlateRootContextProvider } from '../contexts/SlateRootContext';

export const Slate = ({ editor, is, leaf }) => {
  const [value, setValue] = useState([]);

  return (
    <SlateRootContextProvider is={is} leaf={leaf}>
      <SlateEditor editor={editor} value={value} onChange={setValue}>
        <Editable onChange={setValue} />
      </SlateEditor>
    </SlateRootContextProvider>
  );
};
