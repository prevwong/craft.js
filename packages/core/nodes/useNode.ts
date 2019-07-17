import React, { cloneElement, useMemo } from "react";
import { useInternalNode } from "./useInternalNode";
import { Node } from "../interfaces";
import invariant from "invariant";


export function useNode<S>(collect? : (node: Node) => S) {
  const { actions: {setRef, setProp, setNodeEvent}, ...collected } = useInternalNode((node) => collect && collect(node));

  return useMemo(() => {
    return {
      ...collected,
      actions: { setProp},
      connectTarget: (render: any): React.ReactElement => {
        const previousRef = render.ref;
        invariant(previousRef !== "string", "Cannot connect to an element with an existing string ref. Please convert it into a callback ref instead.");
        return cloneElement(render, {
          ref: (ref: HTMLElement) => {
            if ( ref ) {
              setRef("dom", ref);
            }
            if (previousRef) previousRef(ref);
          },
          onMouseOver: (e: React.MouseEvent) => {
            e.stopPropagation();
            setNodeEvent('hover');
            if (render.props.onMouseOver) render.props.onMouseOver(e);
          },
          onMouseDown: (e: React.MouseEvent) => {
            e.stopPropagation();
            setNodeEvent('active');
            if ( render.props.onMouseDown ) render.props.onMouseDown(e);
          }
        })
      }
    }
  }, [collected])
}

