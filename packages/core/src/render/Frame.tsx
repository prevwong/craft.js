import React, { useEffect, useState, useRef } from "react";
import { NodeElement } from "../nodes/NodeElement";
import { ROOT_NODE } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { Nodes } from "../interfaces";

export type Frame = {
  /** The initial document defined in a json string */
  nodes?: Nodes;
  json?: string;
  // TODO(mat) this can be typed in nicer way
  data?: any;
};

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<Frame> = ({ children, json, data }) => {
  const { actions, query } = useInternalEditor();

  const [render, setRender] = useState<React.ReactElement | null>(null);

  const initialState = useRef({
    initialChildren: children,
    initialData: data || (json && JSON.parse(json)),
  });

  useEffect(() => {
    const { setState } = actions;
    const { initialChildren, initialData } = initialState.current;

    if (initialData) {
      setState(initialData);
    } else if (initialChildren) {
      const rootNode = React.Children.only(
        initialChildren
      ) as React.ReactElement;

      const node = query.parseTreeFromReactNode(rootNode, (jsx, node) => {
        if (jsx === rootNode) {
          node.id = ROOT_NODE;
        }
        return node;
      });

      actions.addTreeAtIndex(node);
    }

    setRender(<NodeElement id={ROOT_NODE} />);
  }, [actions, query]);

  return render;
};
