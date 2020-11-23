import React, { useCallback } from 'react';
import { Editable as SlateEditable } from 'slate-react';

import { Element } from './Element';
import { useStateSync } from './useStateSync';
import { useSelectionSync } from './useSelectionSync';
import { CraftWrapper } from './CraftWrapper';

export const Editable = ({ onChange }) => {
  useStateSync({
    onChange: (state) => onChange(state),
  });

  const { enabled } = useSelectionSync();

  const renderElement = useCallback((props) => <Element {...props} />, []);

  return (
    <SlateEditable
      as={CraftWrapper}
      renderElement={renderElement}
      readOnly={!enabled}
    />
  );
};
