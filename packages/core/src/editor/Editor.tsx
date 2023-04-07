import pickBy from 'lodash/pickBy';
import React, { useMemo, useRef, useEffect } from 'react';

import { EditorContext } from './EditorContext';

import { Events } from '../events';
import { EditorStoreConfig } from '../interfaces';
import { EditorStore } from '../store';

type EditorProps = EditorStoreConfig & {
  enabled: boolean;
  store: EditorStore;
};

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<React.PropsWithChildren<
  Partial<EditorProps>
>> = ({
  children,
  enabled,
  resolver,
  onRender,
  onNodesChange,
  indicator,
  store: customEditorStore,
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
    () =>
      customEditorStore ||
      new EditorStore(initialEditorStoreWithStateConfigRef.current),
    [customEditorStore]
  );

  useEffect(() => {
    if (customEditorStore) {
      return;
    }

    if (initialEditorStoreConfigRef.current === editorStoreConfig) {
      return;
    }

    store.reconfigure(editorStoreConfig);
  }, [customEditorStore, store, editorStoreConfig]);

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
