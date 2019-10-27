import React, { cloneElement, useContext, useCallback, useEffect, useRef } from "react";
import { Node, ConnectedNode, NodeRef } from "../interfaces";
import invariant from "invariant";
import { useInternalNode } from "../nodes/useInternalNode";
import { NodeContext } from "../nodes/NodeContext";

export function useNode(): ConnectedNode
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S> {
  const {related } = useContext(NodeContext);
  const { actions: { setRef, setProp, setNodeEvent }, _inNodeContext, ...collected } = useInternalNode(collect);
  let nodeRef = useRef<any>();

  // useEffect(() => {
  //   if ( !nodeRef.current ) return;
    
  //   nodeRef.current.addEventListener('mousedown', onActive)
  //   nodeRef.current.addEventListener('mouseover', onHover);

  //   return (() => {
  //     nodeRef.current.removeEventListener('mousedown', onActive)
  //     nodeRef.current.removeEventListener('mouseover', onHover);
  //   })
  // }, [nodeRef]);

  const onActive = useCallback((e, cb) => {
    e.preventDefault();
    e.stopPropagation();
    setNodeEvent('active');
    if (cb) cb(e);
    return false;
  }, []);

  const onHover = useCallback((e, cb) => {
    e.preventDefault();
    e.stopPropagation();
    setNodeEvent('hover');
    if (cb) cb(e);

    return false;
  }, []);

  return {
    ...collected as any,
    actions: { setProp },
    connectTarget: (render: any, methods: Exclude<NodeRef, 'dom' | 'event'>): React.ReactElement => {
      // invariant(typeof render.type == "string", "Please ensure the root of the connected render template is a HTMl element")
      if ( related  ) console.warn("connectTarget has no effect on a node's related components")
      if (!_inNodeContext || related ) return render;
      const previousRef = render.ref;
      invariant(previousRef !== "string", "Cannot connect to an element with an existing string ref. Please convert it into a callback ref instead.");
     

      if ( methods ) {
        setRef((ref) => {
          Object.keys(methods).forEach((key: keyof Exclude<NodeRef, 'dom'>) => {
              ref[key] = methods[key] as any;
          });
        });
      }

      return cloneElement(render, {
        ref: (dom: HTMLElement) => {
          nodeRef.current = dom;

          if (dom) {
            setRef((ref) => ref.dom = dom);
          }
          dom
          if (previousRef) previousRef(dom);
        },
        onMouseDown: (e: React.MouseEvent) => onActive(e, render.onMouseDown),
        onMouseOver: (e: React.MouseEvent) => onHover(e, render.onMouseOver)
      })
    }
  }
}

