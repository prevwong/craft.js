import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { useSelectionSync } from './useSelectionSync';
import { useStateSync } from './useStateSync';

import { useSlateRoot } from '../contexts/SlateRootContext';
import { Element, Text } from '../render';

export const Editable = ({ onChange }) => {
  const { is } = useSlateRoot();

  useStateSync({
    onChange: (state) => onChange(state),
  });

  const { enabled } = useSelectionSync();

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Text {...props} />, []);

  return (
    <SlateEditable
      as={is}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      readOnly={!enabled}
    />
  );
};
