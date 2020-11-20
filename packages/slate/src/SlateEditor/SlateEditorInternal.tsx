import React, { useCallback } from 'react';
import { Editable } from 'slate-react';
import { useEditor, useNode } from '@craftjs/core';

import { Element } from './Element';
import { useStateSync } from './useStateSync';
import { useSelectionSync } from './useSelectionSync';

export const SlateEditorInternal = ({ onChange }) => {
  useStateSync({
    onChange: (state) => onChange(state),
  });

  const { enabled } = useSelectionSync();

  const renderElement = useCallback((props) => <Element {...props} />, []);

  return (
    <Editable
      as={CraftWrapper}
      renderElement={renderElement}
      readOnly={!enabled}
    />
  );
};

const CraftWrapper = React.forwardRef(
  ({ children, ...props }: any, ref: any) => {
    const { id } = useNode();
    const { connectors } = useEditor();

    // Important: ref must be memoized otherwise Slate goes insane
    const refCallback = useCallback((dom) => {
      ref.current = dom;
      connectors.connect(dom, id);
      connectors.drag(dom, id);
    }, []);

    return (
      <div {...props} ref={refCallback}>
        {children}
      </div>
    );
  }
);
