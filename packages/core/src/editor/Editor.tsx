import { ERROR_RESOLVER_NOT_AN_OBJECT } from '@craftjs/utils';
import React, { useMemo } from 'react';
import invariant from 'tiny-invariant';

import { EditorContext } from './EditorContext';
import { EditorStore, EditorStoreConfig } from './EditorStore';

import { Events } from '../events';
import { Options } from '../interfaces';

type EditorProps = EditorStoreConfig & Options;

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<EditorProps>> = React.memo(
  ({ children, enabled, resolver, ...config }) => {
    // we do not want to warn the user if no resolver was supplied
    if (resolver !== undefined) {
      invariant(
        typeof resolver === 'object' && !Array.isArray(resolver),
        ERROR_RESOLVER_NOT_AN_OBJECT
      );
    }

    const store = useMemo(
      () =>
        new EditorStore(
          {
            enabled: enabled !== undefined ? enabled : true,
            resolver: resolver !== undefined ? resolver : {},
          },
          config
        ),
      [config, enabled, resolver]
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
