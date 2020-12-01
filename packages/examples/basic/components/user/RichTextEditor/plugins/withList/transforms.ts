import castArray from 'lodash/castArray';
import { Editor, Path, Point, Range, Transforms } from 'slate';

export const unwrapNodesByType = (
  editor: Editor,
  types: string[] | string,
  options: {
    at?: Path | Point | Range;
    mode?: 'highest' | 'lowest' | 'all';
    split?: boolean;
    voids?: boolean;
  } = {}
) => {
  const typesArray = castArray<string>(types);

  Transforms.unwrapNodes(editor, {
    match: (n) => typesArray.includes(n.type as string),
    ...options,
  });
};
