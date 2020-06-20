import React, { useEffect } from 'react';

import { Options } from '../interfaces';
import { Events } from '../events';

import { useEditorStore } from './store';
import { EditorContext } from './EditorContext';

export const withDefaults = (options: Partial<Options> = {}) => ({
  onNodesChange: () => null,
  onRender: ({ render }) => render,
  resolver: {},
  nodes: null,
  enabled: true,
  indicator: {
    error: 'red',
    success: 'rgb(98, 196, 98)',
  },
  ...options,
});

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<Options>> = ({
  children,
  ...options
}) => {
  const context = useEditorStore(withDefaults(options));

  useEffect(() => {
    if (context && options)
      context.actions.setOptions((editorOptions) => {
        editorOptions = options;
      });
  }, [context, options]);

  useEffect(() => {
    context.subscribe(
      (_) => ({
        json: context.query.serialize(),
      }),
      () => {
        context.query.getOptions().onNodesChange(context.query);
      }
    );
  }, [context]);

  return context ? (
    <EditorContext.Provider value={context}>
      <Events>{children}</Events>
    </EditorContext.Provider>
  ) : null;
};
