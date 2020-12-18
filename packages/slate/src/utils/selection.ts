import mapValues from 'lodash/mapValues';
import { Editor, Node, Point, Range } from 'slate';

export const createSelectionOnNode = (element: any) => {
  const [leafNode] = Node.last(element, []);
  const text = Node.string(leafNode);

  let point = {
    nodeId: leafNode.id,
    offset: text.length || 0,
  };

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
    return null;
  }

  const newFocus = mapValues(range, (point: any) => {
    if (!point) {
      return null;
    }
    const match = Editor.node(editor, point);
    if (!match) {
      return null;
    }
    const [node] = match;
    return { nodeId: node.id, offset: point.offset };
  });

  return { ...newFocus };
};

export const getSlateRange = (
  editor: Editor,
  focusObject?: any
): Range | undefined => {
  if (!focusObject) {
    return undefined;
  }
  // remove source
  const { anchor, focus } = focusObject;
  return mapValues({ anchor, focus }, (point: any) => {
    if (!point || !point.nodeId) {
      return undefined;
    }
    const match = Array.from(Node.descendants(editor)).find(
      ([node]) => node.id === point.nodeId
    );

    if (!match) {
      return undefined;
    }

    return { path: match[1], offset: point.offset } as Point;
  }) as Range;
};
