import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { useSelectionSync } from './useSelectionSync';
import { useStateSync } from './useStateSync';

import { Element, Text } from '../render';
import { RenderEditable } from './RenderEditable';

export const Editable = ({ onChange }) => {
  useStateSync({
    onChange: (state) => onChange(state),
  });

  const { enabled } = useSelectionSync();

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Text {...props} />, []);

  return (
    <SlateEditable
      as={RenderEditable}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      readOnly={!enabled}
    />
  );
};
