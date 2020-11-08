import React from 'react';

import { EditorState } from '../../interfaces';
import { useEditor } from '../useEditor';

export function connectEditor<C>(collect?: (state: EditorState) => C) {
  return (WrappedComponent: React.ElementType) => {
    return (props: any) => {
      const Editor = collect ? useEditor(collect) : useEditor();
      return <WrappedComponent {...Editor} {...props} />;
    };
  };
}
