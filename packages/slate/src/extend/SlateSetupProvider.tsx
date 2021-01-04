import { useEditor } from '@craftjs/core';
import { useEffectOnce } from '@craftjs/utils';
import React, { useState, createContext, useContext } from 'react';

import { normalizeSlate } from '../normalization';

type SlateSetupProviderProps = {
  editor: Record<string, React.ElementType>;
  elements: Record<string, React.ElementType>;
  leaf: Record<string, React.ElementType>;
};
export const SlateSetupContext = createContext<any>({
  editor: null,
  elements: {},
  leaf: null,
});

// Initializer; Adds Slate normalization function
// TODO: improve API
export const SlateSetupProvider: React.FC<SlateSetupProviderProps> = ({
  children,
  editor: editorResolver,
  elements: elementsResolver,
  leaf: leafResolver,
}) => {
  const editorType = editorResolver[Object.keys(editorResolver)[0]];
  const leafType = leafResolver[Object.keys(leafResolver)[0]];

  const [init, setInit] = useState(false);
  const { actions } = useEditor();

  useEffectOnce(() => {
    actions.setOptions((options) => {
      const { normalizeNodes } = options;
      options.resolver = {
        ...options.resolver,
        ...editorResolver,
        ...elementsResolver,
        ...leafResolver,
      };
      options.normalizeNodes = (state, ...args) => {
        normalizeSlate(editorType, elementsResolver, leafType)(state);
        normalizeNodes(state, ...args);
      };
    });

    setInit(true);
  });

  return (
    <SlateSetupContext.Provider
      value={{ editor: editorType, elements: elementsResolver, leaf: leafType }}
    >
      {init && children}
    </SlateSetupContext.Provider>
  );
};

export const useSlateSetupContext = () => {
  return useContext(SlateSetupContext);
};
