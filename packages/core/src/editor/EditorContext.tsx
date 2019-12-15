import React, { createContext, useEffect, useMemo, useState } from "react";
import { Options } from "../interfaces";
import { createOptions } from "./createOptions";
import { EditorStore, useEditorStore } from "../editor/store";
import { Nodes, EditorEvents } from "../interfaces";
import { ROOT_NODE } from "craftjs-utils";
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
  // console.log(options);
  const memoizedOptions = useMemo(() => {
    return options;
  }, []);


  const context = createEditorContext({options});

  useEffect(() => {
    // console
    // console.log("options", options)
    if ( context ) context.actions.setOptions(options);
  }, [options]);
  

  // useEffect(() => {
  //   return (() => {
  //     context.cleanup();
  //   })
  // }, []);
  

  return context ? (
    <EditorContext.Provider value={context}>
      {children}
    </EditorContext.Provider>
  ) : null
}