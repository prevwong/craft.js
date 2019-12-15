import { EditorState } from "../../interfaces";
import React from "react";
import { useEditor } from "../useEditor";

export function connectEditor<C>(collect?: (state: EditorState) => C) {
  return (WrappedComponent: React.ElementType) => { 
    return (props: any) => {
      const Editor = useEditor(collect);
      return <WrappedComponent {...Editor} {...props} />;
    }
  } 
}
