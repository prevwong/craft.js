import React, { useCallback } from 'react';
import { Delete } from '@craftjs/utils';
import { Editable as SlateEditable } from 'slate-react';

import { useSelectionSync } from './useSelectionSync';

import { Element } from '../render';
import {
  EditableContext,
  RenderEditable,
  DefaultRenderEditable,
} from './RenderEditable';
import { useCraftSlateContext } from '../contexts/CraftSlateProvider';

export const Editable = (
  props: Delete<
    React.ComponentProps<typeof SlateEditable>,
    'renderElement' | 'renderLeaf' | 'readonly'
  >
) => {
  const { leaf: LeafElement } = useCraftSlateContext();

  const { enabled } = useSelectionSync();

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
      />
    </EditableContext.Provider>
  );
};
