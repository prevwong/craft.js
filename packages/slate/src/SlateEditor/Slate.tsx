import React, { useState } from 'react';
import { Delete } from '@craftjs/utils';
import { Slate as SlateEditor } from 'slate-react';

import {
  SlateRootContextProvider,
  SlateRootContextProviderProps,
} from '../contexts/SlateRootContext';
import { Editable } from './Editable';

export type SlateProps = Delete<SlateRootContextProviderProps, 'onChange'>;

export const Slate: React.FC<SlateProps> = ({ children, ...props }) => {
  const [value, setValue] = useState([]);

  return (
    <SlateRootContextProvider
      {...props}
      onChange={(value) => {
        setValue(value);
      }}
    >
      <SlateEditor editor={props.editor} value={value} onChange={setValue}>
        <Editable />
        {children}
      </SlateEditor>
    </SlateRootContextProvider>
  );
};
