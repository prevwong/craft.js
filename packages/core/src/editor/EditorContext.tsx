import React, { createContext, useEffect } from "react";
import { Options } from "../interfaces";
import { createOptions } from "./createOptions";
import { EditorStore, useEditorStore } from "../editor/store";
import { Nodes, EditorEvents } from "../interfaces";
import { ROOT_NODE } from "@craftjs/utils";
import { Canvas } from "../nodes";
import { transformJSXToNode } from "../utils/transformJSX";

export type EditorContext = EditorStore & {
  handlers: any
}

export type EditorContextIntializer = {
  nodes?: Nodes,
  events?: EditorEvents,
  options?: Partial<Options>

}

export const createEditorContext = (
  data: EditorContextIntializer = {
    nodes: {
      [ROOT_NODE]: transformJSXToNode(<Canvas is="div" />)
    },
    events: {
      selected: null,
      hovered: null,
      dragged: null,
      indicator: null
    },
    options: {}
  }
) => {
  const { nodes, events, options } = data;
  const store = useEditorStore(nodes, events, createOptions(options));
  return {
    ...store,
    handlers: {}
  }
}

export const EditorContext = createContext<EditorContext>(null);
export const EditorContextProvider: React.FC<{ options?: Options}> = ({ children, options }) => {
  
  const context = createEditorContext({options});

  useEffect(() => {
    if ( context ) 
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