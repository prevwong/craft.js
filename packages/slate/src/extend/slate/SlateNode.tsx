import { useNode } from '@craftjs/core';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, Slate } from 'slate-react';

export const SlateNode = createContext<any>(null);

export const SlateNodeContextProvider: React.FC<any> = ({
  editor,
  children,
  enabled: intialEnabled,
}) => {
  const { id } = useNode();
  const [value, setValue] = useState([]);
  const [enabled, setEnabled] = useState(intialEnabled || true);

  const actions = useMemo(
    () => ({
      setEditorValue: (value) => {
        setValue(value);
      },
      enableEditing: () => {
        setEnabled(true);
      },
      disableEditing: () => {
        actions.setSelection(null);
        setEnabled(false);
      },
      setSelection: (selection: any) => {
        if (!selection) {
          ReactEditor.deselect(editor);
          editor.selection = null;
          return;
        }

        window.getSelection().removeAllRanges();
        actions.enableEditing();
        ReactEditor.focus(editor);
        Transforms.select(editor, selection);
      },
    }),
    [editor]
  );

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <SlateNode.Provider value={{ id, enabled, actions }}>
        {children}
      </SlateNode.Provider>
    </Slate>
  );
};

export const useSlateNode = () => {
  const context = useContext(SlateNode);
  return context || {};
};
