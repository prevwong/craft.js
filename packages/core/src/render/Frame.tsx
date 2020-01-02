import React, {useEffect, useState, useMemo, useRef } from "react";
import { NodeElement } from "../nodes/NodeElement";
import {Canvas} from "../nodes/Canvas";
import { ROOT_NODE } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { useCallback } from "react";
import invariant from "tiny-invariant";

export type Frame = {
  json?: String
} 

/**
 * A React Component that defines the editable area
 */
export const Frame: React.FC<Frame> = ({
  children,
  json
}) => {
  const { actions: {  reset, replaceNodes }, query: { createNode, deserialize } } = useInternalEditor();

  const memoizedChildren = useMemo(() => {
    return children;
  }, []);
  
  const [render, setRender] = useState<React.ReactElement | null>(null);
  const rerender = useRef(false);

  const guard = useCallback((json) => {
    if (!json) {
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
      const rehydratedNodes = deserialize(json);
      replaceNodes(rehydratedNodes);
    }
    // setTimeout(() => {
      setRender(<NodeElement id={ROOT_NODE} />);
    // }, 2000) 
  }, []);

  useMemo(() => {
    if ( render ) {
      rerender.current = true;
      setRender(null);
    } else {
      guard(json);
    }
  }, [json]);

  useEffect(() => {
   if ( rerender.current ) {
     rerender.current = false;
     guard(json);
   }
  }, [rerender.current]);

  return render;
}

