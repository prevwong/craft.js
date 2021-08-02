import {
  wrapConnectorHooks,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT,
} from '@craftjs/utils';
import { useMemo, useContext } from 'react';
import invariant from 'tiny-invariant';

import { NodeContext } from './NodeContext';

import { useInternalEditor } from '../editor/useInternalEditor';
import { Node } from '../interfaces';

export function useInternalNode<S = null>(collect?: (node: Node) => S) {
  const context = useContext(NodeContext);
  invariant(context, ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT);

  const { id, related } = context;

  const {
    actions: EditorActions,
    query,
    connectors: editorConnectors,
    ...collected
  } = useInternalEditor(
    (state) => id && state.nodes[id] && collect && collect(state.nodes[id])
  );

  const connectors = useMemo(
    () =>
      wrapConnectorHooks({
        connect: (dom: HTMLElement) => editorConnectors.connect(dom, id),
        drag: (dom: HTMLElement) => editorConnectors.drag(dom, id),
      }),
    [editorConnectors, id]
  );

  const actions = useMemo(() => {
    return {
      setProp: (cb: any, throttleRate?: number) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setProp(id, cb);
        } else {
          EditorActions.setProp(id, cb);
        }
      },
      setCustom: (cb: any, throttleRate?: number) => {
        if (throttleRate) {
          EditorActions.history.throttle(throttleRate).setCustom(id, cb);
        } else {
          EditorActions.setCustom(id, cb);
        }
      },
      setHidden: (bool: boolean) => EditorActions.setHidden(id, bool),
    };
  }, [EditorActions, id]);

  return {
    ...collected,
    id,
    related,
    inNodeContext: !!context,
    actions,
    connectors,
  };
}
