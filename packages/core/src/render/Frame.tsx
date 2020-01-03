import React, { useEffect, useState, useRef } from "react";
import { NodeElement } from "../nodes/NodeElement";
import { Canvas } from "../nodes/Canvas";
import { ROOT_NODE } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import invariant from "tiny-invariant";

export type Frame = {
  json?: string;
};

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<Frame> = ({ children, json }) => {
  const { actions, query } = useInternalEditor();

  const [render, setRender] = useState<React.ReactElement | null>(null);

  const initial = useRef({
    initialChildren: children,
    initialJson: json
  });

  useEffect(() => {
    const { replaceNodes, deserialize } = actions;
    const { createNode } = query;

    const { initialChildren: children, initialJson: json } = initial.current;
    if (!json) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(
        rootCanvas.type && rootCanvas.type === Canvas,
        "The immediate child of <Frame /> has to be a Canvas"
      );
      let node = createNode(rootCanvas, {
        id: ROOT_NODE
      });
      replaceNodes({
        [ROOT_NODE]: node
      });
    } else {
      deserialize(json);
    }

    setRender(<NodeElement id={ROOT_NODE} />);
  }, [actions, query]);

  return render;
};
