import React, { useCallback, useMemo } from 'react';
import { Delete } from '@craftjs/utils';
import { Editable as SlateEditable } from 'slate-react';

import { useSelectionSync } from './useSelectionSync';

import { Element } from '../render';
import { connectEditable } from './connectEditable';
import { useCraftSlateContext } from '../contexts/CraftSlateProvider';

const DefaultRenderEditable = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>;
};

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

  return useMemo(() => {
    return (
      <SlateEditable
        {...props}
        as={connectEditable(props.as || DefaultRenderEditable)}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={!enabled}
      />
    );
  }, [enabled]);
};
