import React, { useEffect } from "react";
import { Options } from "../interfaces";
import { useEditorStore } from "../editor/store";
import { EditorContext } from "./EditorContext";
import { Events } from "../events";

export const createEditorStoreOptions = (options: Partial<Options> = {}) => {
  return {
    onRender: ({ render }) => render,
    resolver: {},
    nodes: null,
    enabled: true,
    indicator: {
      error: "red",
      success: "rgb(98, 196, 98)",
    },
    ...options,
  };
};

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<Options>> = ({
  children,
  ...options
}) => {
  const context = useEditorStore(createEditorStoreOptions(options));

  useEffect(() => {
    if (context && options)
      context.actions.setOptions((editorOptions) => {
        editorOptions = options;
      });
  }, [context, options]);

  return context ? (
    <EditorContext.Provider value={context}>
      <Events>{children}</Events>
    </EditorContext.Provider>
  ) : null;
};
