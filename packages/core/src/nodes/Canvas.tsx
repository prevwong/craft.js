import React, { useState, useEffect } from "react";
import { NodeId } from "../interfaces";
import { mapChildrenToNodes } from "../utils/mapChildrenToNodes";
import { useInternalNode } from "./useInternalNode";
import { useInternalEditor } from "../editor/useInternalEditor";
import {
  ERROR_ROOT_CANVAS_NO_ID,
  ERROR_INFINITE_CANVAS,
  useEffectOnce,
} from "@craftjs/utils";
import invariant from "tiny-invariant";
import { SimpleElement } from "../render/SimpleElement";
import { NodeElement } from "./NodeElement";

/**
 * A React Component which defines a droppable region and draggable immediate children
 */
export type Canvas<T extends React.ElementType> = {
  id?: NodeId;
  style?: any;
  className?: any;
  is?: T;
  children?: React.ReactNode;
  passThrough?: boolean;
} & React.ComponentProps<T>;

export function Canvas<T extends React.ElementType>({
  is,
  children,
  passThrough,
  ...props
}: Canvas<T>) {
  const id = props.id;
  const {
    actions: { add, setProp },
    query,
    inContext,
  } = useInternalEditor();
  const { node, inNodeContext } = useInternalNode((node) => ({
    node: {
      id: node.id,
      data: node.data,
    },
  }));
  const [internalId, setInternalId] = useState<NodeId | null>(null);
  const [initialised, setInitialised] = useState(false);

  /** Only create/recreate nodes on the initial render. From there on, the re-renders will be handled by Nodes */
  useEffectOnce(() => {
    const { id: nodeId, data } = node;
    if (inContext && inNodeContext) {
      if (data.isCanvas) {
        invariant(passThrough, ERROR_INFINITE_CANVAS);
        if (!data.nodes) {
          const childNodes = mapChildrenToNodes(children, (jsx) => {
            const node = query.createNode(jsx);
            return node;
          });

          add(childNodes, nodeId);
        }
      } else {
        invariant(id, ERROR_ROOT_CANVAS_NO_ID);

        let internalId;

        const existingNode =
          data._childCanvas &&
          data._childCanvas[id] &&
          query.node(data._childCanvas[id]).get();

        let newProps = { is, ...props };

        if (existingNode) {
          if (existingNode.data.type === is && typeof is !== "string") {
            newProps = {
              ...newProps,
              ...existingNode.data.props,
            };
          }
        }

        const rootNode = query.createNode(
          React.createElement(Canvas, newProps, children),
          existingNode && {
            id: existingNode.id,
            data: existingNode.data,
          }
        );

        internalId = rootNode.id;
        add(rootNode, nodeId);

        setInternalId(internalId);
      }
    }

    setInitialised(true);
  });

  /**
   *
   * (https://github.com/prevwong/craft.js/issues/31)
   * When non-children props on Canvases in User Components are updated, we need to update the prop values in their corresponding Nodes
   * in order to trigger a re-render
   */
  useEffect(() => {
    if (internalId) {
      setProp(internalId, (nodeProps) => {
        Object.entries(props).forEach(([key, value]) => {
          nodeProps[key] = value;
        });
      });
    }
  }, [internalId, props, setProp]);

  return (
    <React.Fragment>
      {initialised ? (
        inContext && inNodeContext ? (
          node.data.isCanvas && node.data.nodes ? (
            <SimpleElement
              render={React.createElement(
                node.data.type,
                props,
                <React.Fragment>
                  {node.data.nodes &&
                    node.data.nodes.map((id: NodeId) => (
                      <NodeElement id={id} key={id} />
                    ))}
                </React.Fragment>
              )}
            />
          ) : internalId ? (
            <NodeElement id={internalId} />
          ) : null
        ) : (
          React.createElement(is as any, props, children)
        )
      ) : null}
    </React.Fragment>
  );
}

// Canvas.name = 'Canvas'
