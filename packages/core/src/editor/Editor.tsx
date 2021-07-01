import React, { useMemo } from 'react';

import { EditorContext } from './EditorContext';
import { EditorStoreImpl, EditorStoreConfig } from '../store';

import { Events } from '../events';
import { EditorState } from '../interfaces';

type EditorProps = EditorStoreConfig & Partial<EditorState>;

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<EditorProps>> = React.memo(
  ({ children, enabled, ...config }) => {
    const store = useMemo(
      () =>
        new EditorStoreImpl({
          state: {
            enabled: enabled !== undefined ? enabled : true,
          },
          ...(config || {}),
        }),
      [config, enabled]
    );

    if (!store) {
      return null;
    }

    return (
      <EditorContext.Provider value={{ store }}>
        <Events>{children}</Events>
      </EditorContext.Provider>
    );
  }
);
