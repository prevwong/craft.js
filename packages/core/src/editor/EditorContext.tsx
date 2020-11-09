import { createContext } from 'react';

import { EditorStore } from './store';

export type EditorContext = EditorStore;
export const EditorContext = createContext<EditorContext>({} as EditorContext);
