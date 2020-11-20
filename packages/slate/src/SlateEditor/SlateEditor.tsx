import React, { useState, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { SlateEditorInternal } from './SlateEditorInternal';
import { withList } from '../plugins/withList';
import { withMarkdownShortcuts } from '../plugins/withMarkdownShortcuts';

export const SlateEditor = () => {
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
    <Slate
      editor={editor}
      value={value}
      onChange={(state) => {
        // console.log(88, state, editor.selection)
        setValue(state);
      }}
    >
      <SlateEditorInternal onChange={setValue} />
    </Slate>
  );
};

SlateEditor.craft = {
  name: 'SlateEditor',
  isCanvas: true,
};
