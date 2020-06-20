import React, { useEffect, useState, useRef } from 'react';
import { NodeElement } from '../nodes/NodeElement';
import { deprecationWarning, ROOT_NODE } from '@craftjs/utils';
import { useInternalEditor } from '../editor/useInternalEditor';
import { SerializedNodes } from '../interfaces';

export type Frame = {
  json?: string;
  data?: string | SerializedNodes;
};

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<Frame> = ({ children, json, data }) => {
  const { actions, query } = useInternalEditor();

  const [render, setRender] = useState<React.ReactElement | null>(null);

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
    const { deserialize } = actions;
    const { initialChildren, initialData } = initialState.current;

    if (initialData) {
      deserialize(initialData);
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

      actions.addNodeTree(node);
    }

    setRender(<NodeElement id={ROOT_NODE} />);
  }, [actions, query]);

  return render;
};
