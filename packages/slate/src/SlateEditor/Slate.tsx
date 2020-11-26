import React, { useState } from 'react';
import { ReactEditor, Slate as SlateEditor } from 'slate-react';

import { Editable } from './Editable';

import {
  SlateRootContextProvider,
  SlateRootContextProviderProps,
} from '../contexts/SlateRootContext';
import { useNode } from '@craftjs/core';

export interface SlateProps extends Partial<SlateRootContextProviderProps> {
  editor: ReactEditor;
}

export const Slate = ({ editor, ...props }: SlateProps) => {
  const [value, setValue] = useState([]);
  const { id } = useNode();

  return (
    <SlateRootContextProvider {...props}>
      <SlateEditor
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      >
        <Editable onChange={setValue} />
      </SlateEditor>
    </SlateRootContextProvider>
  );
};
