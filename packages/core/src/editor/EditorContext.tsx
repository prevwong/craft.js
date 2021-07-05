import { createContext } from 'react';

import { EditorStore } from '../interfaces';

export type EditorContext = {
  store: EditorStore;
};

export const EditorContext = createContext<EditorContext>({} as EditorContext);
