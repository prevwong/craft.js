import React, { useCallback, useMemo } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { useSlateRoot } from '../contexts/SlateRootContext';
import { useStateSync } from './useStateSync';
import { useSelectionSync } from './useSelectionSync';

import { Element, Text } from '../render';
import { RenderEditable } from './RenderEditable';

export const Editable = () => {
  const {
    onChange,
    editable: { onKeyDown },
  } = useSlateRoot();

  useStateSync({
    onChange,
  });

  const { enabled } = useSelectionSync();

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Text {...props} />, []);

  return useMemo(() => {
    return (
      <SlateEditable
        as={RenderEditable}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={!enabled}
        onKeyDown={onKeyDown}
      />
    );
  }, [enabled]);
};
