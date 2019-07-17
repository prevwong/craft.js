import React, { cloneElement, useMemo } from "react";
import { useInternalNode } from "./useInternalNode";
import { Node } from "../interfaces";


export function useNode<S>(collect? : (node: Node) => S) {
  const { actions: {setRef, setProp, setActive}, ...collected } = useInternalNode((node) => collect && collect(node));

  return useMemo(() => {
    return {
      ...collected,
      actions: { setProp},
      connectTarget: (render: React.ReactElement) => {
        return cloneElement(render, {
          ref: (ref: HTMLElement) => {
            if ( ref ) {
              setRef("dom", ref);
            }
          },
          onMouseDown: (e: React.MouseEvent) => {
            e.stopPropagation();
            setActive();
          }
        })
      }
    }
  }, [collected])
}

