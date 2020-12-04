import React, { useCallback } from 'react';
import { Delete } from '@craftjs/utils';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from '../render';
import {
  EditableContext,
  RenderEditable,
  DefaultRenderEditable,
} from './RenderEditable';
import { useCraftSlateContext } from '../contexts/CraftSlateProvider';
import { useSlateNode } from '../contexts/SlateNodeContext';

export const Editable = (
  props: Delete<
    React.ComponentProps<typeof SlateEditable>,
    'renderElement' | 'renderLeaf' | 'readonly'
  >
) => {
  const { leaf: LeafElement } = useCraftSlateContext();
  const { enabled } = useSlateNode();

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <LeafElement {...props} />, []);

  return (
    <EditableContext.Provider value={{ as: props.as || DefaultRenderEditable }}>
      <SlateEditable
        {...props}
        as={RenderEditable}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={!enabled}
        // onKeyDown={(e: any) => {
        //   if (hotkey('esc', e)) {
        //     ReactEditor.deselect(editor);
        //     setEnabled(false);
        //     return;
        //   }
        //   if (props.onKeyDown) {
        //     props.onKeyDown(e);
        //   }
        // }}
      />
    </EditableContext.Provider>
  );
};
