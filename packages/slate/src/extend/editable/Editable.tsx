import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from './Element';
import { RenderEditable } from './RenderEditable';
import { useCraftStateSync } from './useCraftStateSync';

import { useSlateSetupContext } from '../SlateSetupProvider';
import { useSlateNode } from '../slate/SlateNode';

export const Editable = (props: any) => {
  useCraftStateSync();

  const { leaf: LeafElement } = useSlateSetupContext();
  const { enabled } = useSlateNode();

  const renderElement = useCallback(
    (elementProps) => (
      <Element {...elementProps} renderElement={props.renderElement} />
    ),
    []
  );

  const renderLeaf = useCallback((props) => <LeafElement {...props} />, []);

  const renderEditable = useCallback(
    React.forwardRef(({ children, ...attributes }, ref) => (
      <RenderEditable as={props.as} attributes={{ ...attributes, ref }}>
        {children}
      </RenderEditable>
    )),
    []
  );

  return (
    <SlateEditable
      {...props}
      as={renderEditable}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      readOnly={!enabled}
    />
  );
};
