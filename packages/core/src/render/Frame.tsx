import { deprecationWarning, ROOT_NODE } from '@craftjs/utils';
import React, { useRef } from 'react';

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

  const isLoaded = useRef(false);

  if (!isLoaded.current) {
    const initialData = data || json;

    if (initialData) {
      actions.history.ignore().deserialize(initialData);
    } else if (children) {
      const rootNode = React.Children.only(children) as React.ReactElement;

      const node = query.parseReactElement(rootNode).toNodeTree((node, jsx) => {
        if (jsx === rootNode) {
          node.id = ROOT_NODE;
        }
        return node;
      });

      actions.history.ignore().addNodeTree(node);
    }

    isLoaded.current = true;
  }

  return <RenderRootNode />;
};
