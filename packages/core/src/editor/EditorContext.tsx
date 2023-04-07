import { createContext } from 'react';

import { EditorStore } from '../store';

export type EditorContextType = {
  store: EditorStore;
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);
