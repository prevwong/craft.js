import { useEditor, useNode } from '@craftjs/core';
import { useEditor as useSlateEditor } from 'slate-react';
import { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

import { getFocusFromSlateRange } from '../utils/createFocusOnNode';
import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';

const getSlateStateFromCraft = (rteNodeId: string, query) => {
  const nodes = query.getState().nodes;
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) =>
    craftNodeToSlateNode(query.node(id).get(), nodes)
  );
};

export const useStateSync = ({ onChange }: any) => {
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const currentSlateStateRef = useRef<any>(null);

  const { store, query, slateState } = useEditor((state, query) => ({
    slateState: getSlateStateFromCraft(id, query),
  }));

  const setSlateState = useCallback(() => {
    slateEditor.selection = null;

    const newState = getSlateStateFromCraft(id, query);

    currentSlateStateRef.current = newState;
    onChange(newState);
  }, []);

  useEffect(() => {
    const { current: currentSlateState } = currentSlateStateRef;

    if (isEqual(currentSlateState, slateState)) {
      return;
    }

    setSlateState();
  }, [slateState]);

  const extendSlateEditor = useCallback(() => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      if (
        slateEditor.operations.length === 1 &&
        slateEditor.operations[0].type === 'set_selection'
      ) {
        return;
      }

      const flattened = slateNodesToCraft(slateEditor.children, id);

      currentSlateStateRef.current = slateEditor.children;

      const childNodeIds = slateEditor.children.map(
        (node) => node['id']
      ) as string[];

      store.actions.setState((state) => {
        flattened.forEach((node) => {
          const newNode = store.query.parseFreshNode(node).toNode();

          if (!state.nodes[node.id]) {
            state.nodes[node.id] = newNode;
            return;
          }

          state.nodes[node.id].data = newNode.data;
        });

        state.nodes[id].data.nodes = childNodeIds;

        const focus = getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        );
        state.nodes['ROOT'].data.props.selection = {
          id,
          focus,
        };
      });
    };

    slateEditor.apply = (op) => {
      if (op.type === 'set_selection') {
        apply(op);
        return;
      }

      op = applyIdOnOperation(op);
      apply(op);
    };
  }, []);

  useEffect(() => {
    extendSlateEditor();
  }, []);
};
