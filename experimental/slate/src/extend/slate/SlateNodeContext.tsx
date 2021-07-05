import { useNode } from '@craftjs/core';
import React, { createContext, useMemo, useRef, useState } from 'react';
import { Node, Range, Transforms } from 'slate';
import { ReactEditor, Slate } from 'slate-react';

import { SlateNodeContextType } from '../../interfaces';

export const SlateNodeContext = createContext<SlateNodeContextType>({
  id: null,
  enabled: true,
  actions: {
    setEditorValue: () => {},
    enableEditing: () => {},
    disableEditing: () => {},
    setSelection: () => {},
  },
});

export interface SlateNodeContextProviderProps {
  editor: ReactEditor;
  children: React.ElementType;
  enabled: boolean;
}

export const SlateNodeContextProvider: React.FC<SlateNodeContextProviderProps> = ({
  editor,
  children,
  enabled: initialEnabledValue,
}) => {
  const { id } = useNode();
  const [value, setValue] = useState<Node[]>([]);
  const [enabled, setEnabled] = useState<boolean>(initialEnabledValue || true);

  const currentEditorSelectionRef = useRef(editor.selection);
  currentEditorSelectionRef.current = editor.selection;

  const actions = useMemo(
    () => ({
      setEditorValue: (value: Node[]) => {
        setValue(value);
      },
      enableEditing: () => {
        setEnabled(true);
      },
      disableEditing: () => {
        actions.setSelection(null);
        setEnabled(false);
      },
      setSelection: (selection: Range) => {
        if (!selection) {
          // Don't do anything if the editor selection is already null
          if (currentEditorSelectionRef.current === null) {
            return;
          }

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
      <SlateNodeContext.Provider value={{ id, enabled, actions }}>
        {children}
      </SlateNodeContext.Provider>
    </Slate>
  );
};
