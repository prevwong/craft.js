import { EditorState, QueryMethods } from '@craftjs/core';
import flatten from 'lodash/flatten';

import { Text } from '../render';

export const craftNodeToSlateNode = (
  query: any,
  nodeId: string,
  textPropKey: string
) => {
  const craftNode = query.node(nodeId).get();

  const { id, data } = craftNode;
  const {
    name,
    type,
    props: { [textPropKey]: textProp },
    nodes: childNodes,
  } = data;

  const children = childNodes
    ? childNodes.map((id) => craftNodeToSlateNode(query, id, textPropKey))
    : [];

  const toSlateConverter = type.slate && type.slate.toSlateNode;

  const slateNode = {
    id,
    type: name,
    ...(children.length > 0 ? { children } : {}),
    ...(type === Text ? { text: textProp || '' } : {}),
  };

  if (toSlateConverter) {
    toSlateConverter(craftNode)(slateNode);
  }

  return slateNode;
};

export const slateNodesToCraft = (
  state: EditorState,
  slateNodes: any[],
  parentId: string,
  textPropKey: string
): any => {
  const query = QueryMethods(state);

  const resolvers = query.getOptions().resolver;
  return flatten(
    slateNodes.map((slateNode) => {
      const existingCraftNode = state.nodes[slateNode.id];
      const type = resolvers[slateNode.type];
      const toCraftConverter = type['slate'] && type['slate'].toCraftNode;

      const newCraftNode = query
        .parseFreshNode({
          id: slateNode.id,
          data: {
            type,
            parent: parentId,
            nodes: slateNode.children
              ? slateNode.children.map((childNode) => childNode.id)
              : [],
          },
        })
        .toNode((node) => {
          if (toCraftConverter) {
            toCraftConverter(slateNode)(node);
          }

          if (slateNode.text) {
            node.data.props[textPropKey] = slateNode.text;
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
              state,
              slateNode.children,
              slateNode.id,
              textPropKey
            )
          : []),
      ];
    })
  );
};
