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
  const [enabled, setEnabled] = useState(intialEnabled);

  const actions = useMemo(
    () => ({
      setEditorValue: (value) => {
        setValue(value);
      },
      enableEditing: () => {
        setEnabled(true);
      },
      disableEditing: () => {
        editor.selection = null;
        setEnabled(false);
      },
      setSelection: (selection: any) => {
        setEnabled(true);
        ReactEditor.focus(editor);
        Transforms.select(editor, selection);
      },
    }),
    []
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
