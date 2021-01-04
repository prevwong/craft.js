import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from './Element';
import { RenderEditable } from './RenderEditable';
import { useCraftStateSync } from './useCraftStateSync';

import { Leaf } from './Leaf';

export const Editable = (props: any) => {
  useCraftStateSync();

  const renderElement = useCallback(
    (elementProps) => (
      <Element {...elementProps} renderElement={props.renderElement} />
    ),
    []
  );

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
    />
  );
};
