import React, { useEffect, useState, useRef } from "react";
import { NodeElement } from "../nodes/NodeElement";
import { Canvas } from "../nodes/Canvas";
import { ROOT_NODE, ERROR_FRAME_IMMEDIATE_NON_CANVAS } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import invariant from "tiny-invariant";

export type Frame = {
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
    initialJson: json,
    initialData: data
  });

  useEffect(() => {
    const { replaceNodes, deserialize, setState } = actions;
    const { createNode } = query;

    const { initialChildren, initialJson, initialData } = initialState.current;
    if (!!initialJson) {
      deserialize(initialJson);
    } else if (!!initialData) {
      setState(initialData);
    } else {
      const rootCanvas = React.Children.only(
        initialChildren
      ) as React.ReactElement;
      invariant(
        rootCanvas.type && rootCanvas.type === Canvas,
        ERROR_FRAME_IMMEDIATE_NON_CANVAS
      );
      const node = createNode(rootCanvas, { id: ROOT_NODE });
      replaceNodes({ [ROOT_NODE]: node });
    }

    setRender(<NodeElement id={ROOT_NODE} />);
  }, [actions, query]);

  return render;
};
