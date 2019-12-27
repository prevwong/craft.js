import React, {useEffect, useState, useMemo, useRef } from "react";
import { NodeElement, Canvas } from "../nodes";
import { ROOT_NODE } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { useCallback } from "react";

const invariant = require("invariant");
let i= 0;
export type Frame = {
  nodes: String
} & any;

export const Frame: React.FC<Frame> = ({
  children,
  nodes,
  ...props
}) => {
  const { actions: {  reset, replaceNodes }, query: { createNode, deserialize } } = useInternalEditor();

  const memoizedChildren = useMemo(() => {
    return children;
  }, []);
  
  const [render, setRender] = useState(null);
  const rerender = useRef(false);

  const guard = useCallback((nodes) => {
    if (!nodes) {
      const rootCanvas = React.Children.only(memoizedChildren) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Frame /> has to be a Canvas");
      let node = createNode(rootCanvas, {
        id: ROOT_NODE
      })
      reset();
      replaceNodes({
        [ROOT_NODE]: node
      });
    } else {
      const rehydratedNodes = deserialize(nodes);
      replaceNodes(rehydratedNodes);
    }
    setRender(<NodeElement id={ROOT_NODE} />);
  }, []);

  useMemo(() => {
    if ( render ) {
      rerender.current = true;
      setRender(null);
    } else {
      guard(nodes);
    }
  }, [nodes]);

  useEffect(() => {
   if ( rerender.current ) {
     rerender.current = false;
     guard(nodes);
   }
  }, [rerender.current]);

  return render;
}

