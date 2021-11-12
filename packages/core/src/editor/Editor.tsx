import React, { useMemo, useRef, useEffect } from 'react';

import { EditorContext } from './EditorContext';

import { Events } from '../events';
import { EditorState, EditorStoreConfig } from '../interfaces';
import { EditorStore } from '../store';

type EditorProps = EditorStoreConfig & Partial<EditorState>;

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<EditorProps>> = ({
  children,
  enabled,
  resolver,
  ...config
}) => {
  const initialConfigRef = useRef({
    state: {
      enabled: enabled !== undefined ? enabled : true,
      resolver,
    },
    ...(config || {}),
  });

  const store = useMemo(() => new EditorStore(initialConfigRef.current), []);

  useEffect(() => {
    if (store.getState().resolver === resolver) {
      return;
    }

    store.actions.setResolver(resolver);
  }, [store, resolver]);

  if (!store) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ store }}>
      <Events>{children}</Events>
    </EditorContext.Provider>
  );
};
