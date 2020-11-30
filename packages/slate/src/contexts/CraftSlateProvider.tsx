import React, { useState, useEffect, createContext, useContext } from 'react';
import { ROOT_NODE, useEditor } from '@craftjs/core';
import { normalizeSlate } from '../normalization';

type CraftSlateProviderProps = {
  editor: Record<string, React.ElementType>;
  elements: Record<string, React.ElementType>;
  leaf: Record<string, React.ElementType>;
};
export const CraftSlateContext = createContext<any>({
  editor: null,
  elements: {},
  leaf: null,
});

export const CraftSlateProvider: React.FC<CraftSlateProviderProps> = ({
  children,
  editor: editorResolver,
  elements: elementsResolver,
  leaf: leafResolver,
}) => {
  const editorType = editorResolver[Object.keys(editorResolver)[0]];
  const leafType = leafResolver[Object.keys(leafResolver)[0]];

  const [init, setInit] = useState(false);
  const { actions, query, rootNodeExists } = useEditor((state) => ({
    rootNodeExists: !!state.nodes[ROOT_NODE],
  }));

  // Store caret prop on root node
  // TODO: think of a better way of setting this initial value
  useEffect(() => {
    if (!rootNodeExists) {
      return;
    }

    const rootNode = query.node(ROOT_NODE).get();
    if (rootNode.data.custom['caret'] !== undefined) {
      return;
    }

    actions.history.ignore().setCustom(ROOT_NODE, (custom) => {
      custom.caret = null;
    });
  }, [rootNodeExists]);

  useEffect(() => {
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
  }, []);

  return (
    <CraftSlateContext.Provider
      value={{ editor: editorType, elements: elementsResolver, leaf: leafType }}
    >
      {init && children}
    </CraftSlateContext.Provider>
  );
};

export const useCraftSlateContext = () => {
  return useContext(CraftSlateContext);
};
