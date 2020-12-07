import { useNode, useEditor } from '@craftjs/core';
import React, { createContext, useContext, useMemo, useState } from 'react';

export const SlateNodeContext = createContext<any>(null);

export const SlateNodeContextProvider: React.FC<any> = ({
  enabled,
  children,
}) => {
  const { id } = useNode();
  const { actions: editorActions } = useEditor();

  const actions = useMemo(
    () => ({
      setSelectionInElement: (selection: any) => {
        editorActions.history.ignore().setState((state) => {
          // Setting the selection in the Craft node, will subsequently update the Slate selection
          // Note: We should improve this API
          state.nodes[id].data.custom.selection = selection;
        });
      },
    }),
    []
  );

  return (
    <SlateNodeContext.Provider value={{ id, enabled, actions }}>
      {children}
    </SlateNodeContext.Provider>
  );
};

export const useSlateNode = () => {
  const context = useContext(SlateNodeContext);
  return context || {};
};
