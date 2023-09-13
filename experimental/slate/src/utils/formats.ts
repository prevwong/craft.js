import { EditorState, QueryMethods } from '@craftjs/core';
import { QueryCallbacksFor } from 'craftjs-utils-meetovo';
import flatten from 'lodash/flatten';
import { Text } from 'slate';

import { SlateResolvers, SlateElement } from '../interfaces';

// Convert a Craft node to Slate node
export const craftNodeToSlateNode = (
  query: QueryCallbacksFor<typeof QueryMethods>,
  nodeId: string
) => {
  const craftNode = query.node(nodeId).get();

  const { id, data } = craftNode;
  const { name, type, nodes: childNodes } = data;

  const children = childNodes
    ? childNodes.map((id) => craftNodeToSlateNode(query, id))
    : [];

  const toSlateConverter =
    (type as any).slate && (type as any).slate.toSlateNode;

  const slateNode = {
    id,
    type: name,
    ...(children.length > 0 ? { children } : {}),
  };

  if (toSlateConverter) {
    toSlateConverter(craftNode)(slateNode);
  }

  // Just to maintain some symmetry with Slate's API where the leaf element typically does not have a "type" prop
  if (Text.isText(slateNode)) {
    delete slateNode['type'];
  }

  return slateNode;
};

// Convert slateNodes into Craft nodes
export const slateNodesToCraft = (
  rteResolvers: SlateResolvers,
  state: EditorState,
  slateNodes: SlateElement[],
  parentId: string
): any => {
  const query = QueryMethods(state);
  const resolvers = query.getOptions().resolver;

  return flatten(
    slateNodes.map((slateNode) => {
      const existingCraftNode = state.nodes[slateNode.id];

      const type = Text.isText(slateNode)
        ? rteResolvers.leaf
        : resolvers[slateNode.type];
      const toCraftConverter = type['slate'] && type['slate'].toCraftNode;

      const newCraftNode = query
        .parseFreshNode({
          id: slateNode.id,
          data: {
            type,
            parent: parentId,
            nodes: slateNode.children
              ? slateNode.children.map(
                  (childNode: SlateElement) => childNode.id
                )
              : [],
          },
        })
        .toNode((node) => {
          if (toCraftConverter) {
            toCraftConverter(slateNode)(node);
          }
        });

      if (
        existingCraftNode &&
        existingCraftNode.data.type === newCraftNode.data.type
      ) {
        state.nodes[slateNode.id].data = newCraftNode.data;
      } else {
        state.nodes[slateNode.id] = newCraftNode;
      }

      return [
        newCraftNode,
        ...(slateNode.children
          ? slateNodesToCraft(
              rteResolvers,
              state,
              slateNode.children as SlateElement[],
              slateNode.id
            )
          : []),
      ];
    })
  );
};
