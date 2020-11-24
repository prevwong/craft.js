import React, { useState } from 'react';
import { ReactEditor, Slate as SlateEditor } from 'slate-react';

import { Editable } from './Editable';

import {
  SlateRootContextProvider,
  SlateRootContextProviderProps,
} from '../contexts/SlateRootContext';

export interface SlateProps extends SlateRootContextProviderProps {
  editor: ReactEditor;
}

export const Slate = ({ editor, ...props }: SlateProps) => {
  const [value, setValue] = useState([]);

  return (
    <SlateRootContextProvider {...props}>
      <SlateEditor editor={editor} value={value} onChange={setValue}>
        <Editable onChange={setValue} />
      </SlateEditor>
    </SlateRootContextProvider>
  );
};
