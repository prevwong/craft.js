import { deprecationWarning, ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef } from 'react';

import { useInternalEditor } from '../editor/useInternalEditor';
import { SerializedNodes } from '../interfaces';
import { NodeElement } from '../nodes/NodeElement';

export type FrameProps = {
  json?: string;
  data?: string | SerializedNodes;
};

const RenderRootNode = () => {
  const { timestamp } = useInternalEditor((state) => ({
    timestamp:
      state.nodes[ROOT_NODE] && state.nodes[ROOT_NODE]._hydrationTimestamp,
  }));

  if (!timestamp) {
    return null;
  }

  return <NodeElement id={ROOT_NODE} key={timestamp} />;
};

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<React.PropsWithChildren<FrameProps>> = ({
  children,
  json,
  data,
}) => {
  const { actions, query } = useInternalEditor();

  if (!!json) {
    deprecationWarning('<Frame json={...} />', {
      suggest: '<Frame data={...} />',
    });
  }

  const initialState = useRef({
    initialChildren: children,
    initialData: data || json,
  });

  const isInitialLoadedRef = useRef(false);

  if (!isInitialLoadedRef.current && initialState.current.initialData) {
    actions.history.ignore().deserialize(initialState.current.initialData);
    isInitialLoadedRef.current = true;
  }

  useEffect(() => {
    const { initialChildren } = initialState.current;

    // Prevent recreating Nodes from child elements if we already did it the first time
    // Usually an issue in React Strict Mode where this hook is called twice which results in orphaned Nodes
    const isInitialLoaded = isInitialLoadedRef.current;

    if (!initialChildren || isInitialLoaded) {
      return;
    }

    const rootNode = React.Children.only(initialChildren) as React.ReactElement;

    const node = query.parseReactElement(rootNode).toNodeTree((node, jsx) => {
      if (jsx === rootNode) {
        node.id = ROOT_NODE;
      }
      return node;
    });

    actions.history.ignore().addNodeTree(node);
    isInitialLoadedRef.current = true;
  }, [actions, query]);

  return <RenderRootNode />;
};
