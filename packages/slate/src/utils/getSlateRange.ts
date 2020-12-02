import mapValues from 'lodash/mapValues';
import { Editor, Node, Point, Range } from 'slate';

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
