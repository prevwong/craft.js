import pickBy from 'lodash/pickBy';
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
  onRender,
  onNodesChange,
  indicator,
}) => {
  // TODO: refactor editor store config
  const editorStoreConfig = useMemo(() => {
    return pickBy(
      { onRender, onNodesChange, resolver, indicator },
      (value) => value !== undefined
    );
  }, [indicator, onNodesChange, onRender, resolver]);

  const initialEditorStoreConfigRef = useRef(editorStoreConfig);

  const initialEditorStoreWithStateConfigRef = useRef({
    ...initialEditorStoreConfigRef.current,
    state: {
      enabled: enabled !== undefined ? !!enabled : true,
    },
  });

  const store = useMemo(
    () => new EditorStore(initialEditorStoreWithStateConfigRef.current),
    []
  );

  useEffect(() => {
    if (initialEditorStoreConfigRef.current === editorStoreConfig) {
      return;
    }

    console.log('set config');
    store.reconfigure(editorStoreConfig);
  }, [store, editorStoreConfig]);

  useEffect(() => {
    if (enabled === undefined) {
      return;
    }

    if (!!enabled === store.getState().enabled) {
      return;
    }

    store.actions.setEnabled(enabled);
  }, [store, enabled]);

  if (!store) {
    return null;
  }

  return (
    <EditorContext.Provider value={{ store }}>
      <Events>{children}</Events>
    </EditorContext.Provider>
  );
};
