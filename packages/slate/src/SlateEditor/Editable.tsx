import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from './Element';
import {
  EditableContext,
  RenderEditable,
  DefaultRenderEditable,
} from './RenderEditable';
import { useCraftSlateContext } from '../contexts/CraftSlateProvider';
import { useCraftStateSync } from './CraftStateSync';
import { useSlateNode } from './SlateNodeContext';

export const Editable = (props: any) => {
  const { leaf: LeafElement } = useCraftSlateContext();

  const { enabled } = useSlateNode();

  useCraftStateSync();

  const renderElement = useCallback(
    (elementProps) => (
      <Element {...elementProps} renderElement={props.renderElement} />
    ),
    []
  );

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
