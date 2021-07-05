import { Element } from 'slate';

export type SlateElement = Element & { id: string; type?: string };
