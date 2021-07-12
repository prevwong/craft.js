import { ERROR_RESOLVER_NOT_AN_OBJECT } from '@craftjs/utils';
import { pickBy } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { EditorContext } from './EditorContext';
import { useEditorStore } from './store';

import { Events } from '../events';
import { Options } from '../interfaces';

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<Options>> = ({
  children,
  onRender,
  onNodesChange,
  resolver,
  enabled,
  indicator,
}) => {
  // we do not want to warn the user if no resolver was supplied
  if (resolver !== undefined) {
    invariant(
      typeof resolver === 'object' && !Array.isArray(resolver),
      ERROR_RESOLVER_NOT_AN_OBJECT
    );
  }

  const options = useMemo(() => {
    return pickBy(
      { onRender, onNodesChange, resolver, enabled, indicator },
      (value) => value !== undefined
    );
  }, [enabled, indicator, onNodesChange, onRender, resolver]);

  const context = useEditorStore(options);

  useEffect(() => {
    if (context && options) {
      context.actions.setOptions((editorOptions) => {
        Object.assign(editorOptions, options);
      });
    }
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
