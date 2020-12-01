import React, { Fragment, useState } from 'react';
import { Slate as SlateEditor } from 'slate-react';

import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { CraftStateSync } from './CraftStateSync';

export const Slate: React.FC<any> = ({ children, editor }) => {
  const [value, setValue] = useState([]);

  return (
    <Fragment>
      <CraftStateSync editor={editor} onChange={setValue} />
      <SlateEditor editor={editor} value={value} onChange={setValue}>
        <SlateNodeContextProvider>{children}</SlateNodeContextProvider>
      </SlateEditor>
    </Fragment>
  );
};
