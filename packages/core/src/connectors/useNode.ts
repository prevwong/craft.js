import React, { cloneElement, useContext } from "react";
import { Node, ConnectedNode, NodeRef } from "../interfaces";
import invariant from "invariant";
import { useInternalNode } from "../nodes/useInternalNode";
import { NodeContext } from "../nodes/NodeContext";
import { isCanvas } from "../nodes";
import { DNDContext } from "../dnd/DNDManager";
import { ROOT_NODE } from "craftjs-utils";


export function useNode(): ConnectedNode
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S>
export function useNode<S = null>(collect?: (node: Node) => S): ConnectedNode<S> {
  const {id, related } = useContext(NodeContext);
  const handlers = useContext(DNDContext);
  const { actions: { setRef, setProp, setNodeEvent }, _inNodeContext, ...collected } = useInternalNode(collect);

  return {
    ...collected as any,
    actions: { setProp },
    connectDragHandler: (render: any) => {
      return React.cloneElement(render, {
        draggable: id !== ROOT_NODE,
        onDragStart: (e: React.MouseEvent) => {
          e.stopPropagation();
          handlers.onDragStart(e, id);
        }
      })
    },
    connectTarget: (render: any, methods: Exclude<NodeRef, 'dom' | 'event'>): React.ReactElement => {
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
          if (dom) {
            setRef((ref) => ref.dom = dom);
          }

          if (previousRef) previousRef(dom);
        },
        onMouseDown: (e: React.MouseEvent) => {
          e.stopPropagation();
          setNodeEvent('active');
        },
        onMouseOver: (e: React.MouseEvent) => {
          e.stopPropagation();
          setNodeEvent('hover');
        },
        onDragOver: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          handlers.onDragOver(e, id);
        },
       
        onDragEnd: (e: React.MouseEvent)  => {
          e.stopPropagation();
          handlers.onDragEnd(e);
        }
      })
    }
  }
}

