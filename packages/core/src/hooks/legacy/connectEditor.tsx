import React from 'react';

import { EditorQuery } from '../../store';
import { useEditor } from '../useEditor';

export function connectEditor<C>(collect?: (query: EditorQuery) => C) {
  return (WrappedComponent: React.ElementType) => {
    return (props: any) => {
      const Editor = collect ? useEditor(collect) : useEditor();
      return <WrappedComponent {...Editor} {...props} />;
    };
  };
}
