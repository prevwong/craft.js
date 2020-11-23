import React, { useState, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate as SlateEditor, withReact } from 'slate-react';

import { Editable } from './Editable';

import { withList } from '../plugins/withList';
import { withMarkdownShortcuts } from '../plugins/withMarkdownShortcuts';

export const Slate = () => {
  const [value, setValue] = useState([]);
  const editor = useMemo(
    () =>
      withMarkdownShortcuts(
        withList({
          typeLi: 'ListItem',
          typeOl: 'List',
          typeUl: 'List',
          typeP: 'Typography',
        })(withReact(createEditor()))
      ),
    []
  );

  return (
    <SlateEditor editor={editor} value={value} onChange={setValue}>
      <Editable onChange={setValue} />
    </SlateEditor>
  );
};

Slate.craft = {
  isCanvas: true,
};
