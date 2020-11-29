import { ROOT_NODE, useEditor, useNode } from '@craftjs/core';
import { useEffect, useRef, useState } from 'react';
import { Transforms } from 'slate';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';

import { useCaret } from '../caret';
import { getSlateRange } from '../utils/getSlateRange';

export const useSelectionSync = () => {
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const { query, actions } = useEditor();
  const [enabled, setEnabled] = useState(false);

  const enabledRef = useRef<boolean>(enabled);

  // Store caret prop on root node
  // TODO: think of a better way of setting this initial value
  useEffect(() => {
    const rootNode = query.node(ROOT_NODE).get();
    if (!rootNode) {
      return;
    }

    if (!!rootNode.data.custom['caret']) {
      return;
    }

    actions.history.ignore().setCustom(ROOT_NODE, (custom) => {
      custom.caret = {
        id: null,
        selection: null,
      };
    });
  }, []);

  useCaret((value) => {
    Promise.resolve().then(() => {
      if (!value) {
        if (enabledRef.current) {
          ReactEditor.deselect(slateEditor);
          enabledRef.current = false;
          setEnabled(false);
        }
        return;
      }

      enabledRef.current = true;

      const newSelection = getSlateRange(slateEditor, value);

      if (!newSelection) {
        return;
      }

      if (!newSelection.anchor || !newSelection.focus) {
        return;
      }

      setEnabled(true);
      ReactEditor.focus(slateEditor);
      Transforms.select(slateEditor, newSelection);
    });
  }, id);

  return { enabled };
};
