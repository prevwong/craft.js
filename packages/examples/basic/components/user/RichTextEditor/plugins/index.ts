import { withReact } from 'slate-react';

import { withList } from './withList';
import { withMarkdownShortcuts } from './withMarkdownShortcuts';

export default [
  withMarkdownShortcuts,
  withList({
    typeLi: 'ListItem',
    typeOl: 'List',
    typeP: 'Typography',
    typeUl: 'List',
  }),
  withReact,
];
