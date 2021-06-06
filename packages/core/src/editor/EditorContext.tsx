import { createContext } from 'react';

import { EditorStore } from './EditorStore';

export type EditorContext = {
  store: EditorStore;
};

export const EditorContext = createContext<EditorContext>({} as EditorContext);
