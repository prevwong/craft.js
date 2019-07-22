import React, { cloneElement, useMemo } from "react";
import { Node, ConnectedNode, NodeRef } from "../interfaces";
import invariant from "invariant";
import { useInternalNode } from "../nodes/useInternalNode";


export function useNode(): ConnectedNode
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S> {
  const { actions: { setRef, setProp, setNodeEvent }, ...collected } = useInternalNode(collect);

  return {
    ...collected as any,
    actions: { setProp },
    connectTarget: (render: any, methods: Exclude<NodeRef, 'dom' | 'event'>): React.ReactElement => {
      const previousRef = render.ref;
      invariant(previousRef !== "string", "Cannot connect to an element with an existing string ref. Please convert it into a callback ref instead.");
      if ( methods ) Object.keys(methods).forEach((key: keyof Exclude<NodeRef, 'dom' | 'event'>) => {
        setRef(key, methods[key]);
      });

      return cloneElement(render, {
        ref: (ref: HTMLElement) => {
          if (ref) {
            // console.log("MAIN", ref)
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
          setNodeEvent('selected');
          setNodeEvent('active');
          if (render.props.onMouseDown) render.props.onMouseDown(e);
        }
      })
    }
  }
}

