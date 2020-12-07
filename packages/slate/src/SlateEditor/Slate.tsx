import React, { Fragment, useState } from 'react';
import { Slate as SlateEditor } from 'slate-react';

import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { CraftStateSync } from './CraftStateSync';

export const Slate: React.FC<any> = ({
  children,
  editor,
  disableOnDeselect,
}) => {
  const [value, setValue] = useState([]);

  return (
    <Fragment>
      <SlateEditor editor={editor} value={value} onChange={setValue}>
        <CraftStateSync
          onChange={setValue}
          disableOnDeselect={disableOnDeselect}
        >
          {children}
        </CraftStateSync>
      </SlateEditor>
    </Fragment>
  );
};
