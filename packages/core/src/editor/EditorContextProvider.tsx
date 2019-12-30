import React, {  useEffect } from "react";
import { Options } from "../interfaces";
import {  useEditorStore } from "../editor/store";
import { EditorContext } from "./EditorContext";


export const EditorContextProvider: React.FC<{ options?: Partial<Options>}> = ({ children, options }) => {
  const mergedOptions = {
    onRender: ({ render }) => render,
    resolver: {},
    nodes: null,
    enabled: true,
    indicator: {
      error: "red",
      success: "rgb(98, 196, 98)"
    },
    ...options
  }

  const context = useEditorStore(mergedOptions);

  useEffect(() => {
    if ( context && options ) 
      context.actions.setOptions((editorOptions) => {
        editorOptions = options;
      });
  }, [options]);
  
  return context ? (
    <EditorContext.Provider value={context}>
      {children}
    </EditorContext.Provider>
  ) : null
}