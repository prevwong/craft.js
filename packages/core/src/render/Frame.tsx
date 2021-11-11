import { deprecationWarning, ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef } from 'react';

import { useInternalEditor } from '../editor/useInternalEditor';
import { SerializedNodes } from '../interfaces';
import { NodeElement } from '../nodes/NodeElement';

export type Frame = {
  json?: string;
  data?: string | SerializedNodes;
};

const RenderRootNode = () => {
  const { timestamp, isRootNodeExist } = useInternalEditor((state) => ({
    timestamp: state.timestamp,
    isRootNodeExist: !!state.node(ROOT_NODE),
  }));

  if (!timestamp || !isRootNodeExist) {
    return null;
  }

  return <NodeElement id={ROOT_NODE} key={timestamp} />;
};

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<Frame> = ({ children, json, data }) => {
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

  useEffect(() => {
    const { initialChildren, initialData } = initialState.current;

    if (initialData) {
      actions.history.ignore().deserialize(initialData);
    } else if (initialChildren) {
      const rootNode = React.Children.only(
        initialChildren
      ) as React.ReactElement;

      const node = query.parseReactElement(rootNode).toNodeTree((node, jsx) => {
        if (jsx === rootNode) {
          node.id = ROOT_NODE;
        }
        return node;
      });

      actions.history.ignore().addNodeTree(node);
    }
  }, [actions, query]);

  return <RenderRootNode />;
};
