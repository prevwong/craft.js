import { Editor } from 'slate';
import mapValues from 'lodash/mapValues';

export const createFocusOnNode = (nodeId: string, query) => {
  const node = query.node(nodeId).get();

  let point = {
    nodeId: node.id,
    offset: 0,
  };

  // If the node is Typography, we want to focus at the last Text child node
  if (node.data.nodes && node.data.nodes.length > 0) {
    const lastChildId = node.data.nodes[node.data.nodes.length - 1];
    if (lastChildId) {
      const lastChild = query.node(lastChildId).get();
      point = {
        nodeId: lastChildId,
        offset: (lastChild.data.props.text || []).length,
      };
    }
  }

  return {
    anchor: point,
    focus: point,
  };
};

/**
 * Given an editor and a slate range, it transforms it to a Craft range
 *
 * @param editor
 * @param range
 */
export const getFocusFromSlateRange = (
  editor: Editor,
  range?: Range | Partial<Range>
): any => {
  if (!range) {
    return undefined;
  }

  const newFocus = mapValues(range, (point: any) => {
    if (!point) {
      return undefined;
    }
    const match = Editor.node(editor, point);
    if (!match) {
      return undefined;
    }
    const [node] = match;
    return { nodeId: node.id, offset: point.offset };
  });

  return { ...newFocus };
};
