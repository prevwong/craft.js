import { ERROR_RESOLVER_NOT_AN_OBJECT, HISTORY_ACTIONS } from '@craftjs/utils';
import pickBy from 'lodash/pickBy';
import React, { useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { EditorContext } from './EditorContext';
import { useEditorStore } from './store';

import { Events } from '../events';
import { Options } from '../interfaces';

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<React.PropsWithChildren<Partial<Options>>> = ({
  children,
  onRender,
  onNodesChange,
  onBeforeMoveEnd,
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
      {
        onRender,
        onNodesChange,
        onBeforeMoveEnd,
        resolver,
        enabled,
        indicator,
      },
      (value) => value !== undefined
    );
  }, [enabled, indicator, onBeforeMoveEnd, onNodesChange, onRender, resolver]);

  const context = useEditorStore(
    options,
    (state, previousState, actionPerformedWithPatches, query, normalizer) => {
      if (!actionPerformedWithPatches) {
        return;
      }

      const { patches, ...actionPerformed } = actionPerformedWithPatches;

      for (let i = 0; i < patches.length; i++) {
        const { path } = patches[i];
        const isModifyingNodeData =
          path.length > 2 && path[0] === 'nodes' && path[2] === 'data';

        let actionType = actionPerformed.type;

        if (
          [HISTORY_ACTIONS.IGNORE, HISTORY_ACTIONS.THROTTLE].includes(
            actionType
          ) &&
          actionPerformed.params
        ) {
          actionPerformed.type = actionPerformed.params[0];
        }

        if (
          ['setState', 'deserialize'].includes(actionPerformed.type) ||
          isModifyingNodeData
        ) {
          normalizer((draft) => {
            if (state.options.normalizeNodes) {
              state.options.normalizeNodes(
                draft,
                previousState,
                actionPerformed,
                query
              );
            }
          });
          break; // we exit the loop as soon as we find a change in node.data
        }
      }
    }
  );

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
