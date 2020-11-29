import React, { useState, useEffect, createContext, useContext } from 'react';
import { useEditor } from '@craftjs/core';
import { normalizeSlate } from '../normalization';

export const CraftSlateContext = createContext<any>(null);

type CraftSlateProviderProps = {
  editor: React.ElementType;
  elements: Record<string, React.ElementType>;
  leaf: React.ElementType;
};

export const CraftSlateProvider: React.FC<CraftSlateProviderProps> = ({
  children,
  editor,
  elements,
  leaf,
}) => {
  const [init, setInit] = useState(false);
  const { actions } = useEditor();

  useEffect(() => {
    actions.setOptions((options) => {
      const { normalizeNodes } = options;
      options.resolver = {
        ...options.resolver,
        [(editor as any).name]: editor,
        [(leaf as any).name]: leaf,
        ...elements,
      };
      options.normalizeNodes = (state, ...args) => {
        normalizeSlate(editor, elements, leaf)(state);
        normalizeNodes(state, ...args);
      };
    });

    setInit(true);
  }, []);

  return (
    <CraftSlateContext.Provider value={{ editor, elements, leaf }}>
      {init && children}
    </CraftSlateContext.Provider>
  );
};

export const useCraftSlateContext = () => {
  return useContext(CraftSlateContext);
};
