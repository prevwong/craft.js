import mapValues from 'lodash/mapValues';
import { Editor, Node } from 'slate';

import { CaretSelection } from '../caret/types';

export const createSelectionOnNode = (element: any): CaretSelection => {
  const [leafNode] = Node.last(element, []);
  const text = Node.string(leafNode);

  let point = {
    nodeId: leafNode.id,
    offset: text.length || 0,
  };

  return {
    anchor: point,
    focus: point,
  } as CaretSelection;
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
