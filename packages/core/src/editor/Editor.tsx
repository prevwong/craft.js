import { ERROR_RESOLVER_NOT_AN_OBJECT } from '@craftjs/utils';
import React, { useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { EditorContext } from './EditorContext';
import { EditorStore, editorInitialState } from './EditorStore';

import { Events } from '../events';
import { Options } from '../interfaces';

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<Options>> = ({
  children,
  ...options
}) => {
  // we do not want to warn the user if no resolver was supplied
  if (options.resolver !== undefined) {
    invariant(
      typeof options.resolver === 'object' && !Array.isArray(options.resolver),
      ERROR_RESOLVER_NOT_AN_OBJECT
    );
  }

  const store = useMemo(
    () =>
      new EditorStore({
        ...editorInitialState,
        options: {
          ...editorInitialState.options,
          ...options,
        },
      }),
    [options]
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(
      (_) => ({
        json: store.query.serialize(),
      }),
      () => {
        store.query.getOptions().onNodesChange(store.query);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [store]);

  if (!store) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ store }}>
      <Events>{children}</Events>
    </EditorContext.Provider>
  );
};
