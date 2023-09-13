import { Delete } from 'craftjs-utils-meetovo';
import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from './Element';
import { Leaf } from './Leaf';
import { RenderEditable } from './RenderEditable';
import { useCraftStateSync } from './useCraftStateSync';

type EditableProps = Delete<
  React.ComponentProps<typeof SlateEditable>,
  'renderLeaf'
>;

export const Editable = (props: EditableProps) => {
  useCraftStateSync();

  const renderElement = useCallback(
    (elementProps) => (
      <Element {...elementProps} renderElement={props.renderElement} />
    ),
    [props.renderElement]
  );

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const renderEditable = useCallback(
    React.forwardRef(({ children, ...attributes }, ref) => (
      <RenderEditable as={props.as} attributes={{ ...attributes, ref }}>
        {children}
      </RenderEditable>
    )),
    [props.as]
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
