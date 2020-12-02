import { Editor, Path, Point, Range, Transforms, Element } from 'slate';

import { isRangeAtRoot } from './queries';
import { withResetBlockType } from './reset-block-type';
import { unwrapNodesByType } from './transforms';
import { WithListOptions } from './types';

// TODO should these types have defaults since they are optional ?
// this is important when unwrapping, remove defaults to see the problem

export const withList = ({
  typeUl = 'ul',
  typeOl = 'ol',
  typeLi = 'li',
  typeP = 'p',
}: WithListOptions = {}) => <T extends Editor>(editor: T) => {
  const { insertBreak, normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Check if ListItem is valid
    if (Element.isElement(node) && node.type === 'ListItem') {
      const [parent] = Editor.parent(editor, path);

      if (parent.type !== 'List') {
        // wrap in list and return
        Transforms.wrapNodes(
          editor,
          { type: 'List', children: [] },
          { at: path }
        );
        return;
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  /**
   * Add a new list item if selection is in a LIST_ITEM > typeP.
   */
  // eslint-disable-next-line no-param-reassign
  editor.insertBreak = () => {
    if (editor.selection && !isRangeAtRoot(editor.selection)) {
      const [paragraphNode, paragraphPath] = Editor.parent(
        editor,
        editor.selection
      );

      if (paragraphNode.type === typeP) {
        const [listItemNode, listItemPath] = Editor.parent(
          editor,
          paragraphPath
        );

        if (listItemNode.type === typeLi) {
          if (!Range.isCollapsed(editor.selection)) {
            Transforms.delete(editor);
          }

          const start = Editor.start(editor, paragraphPath);
          const end = Editor.end(editor, paragraphPath);

          const isStart = Point.equals(editor.selection.anchor, start);
          const isEnd = Point.equals(editor.selection.anchor, end);

          const nextParagraphPath = Path.next(paragraphPath);
          const nextListItemPath = Path.next(listItemPath);

          /**
           * If start, insert a list item before
           */
          if (isStart) {
            Transforms.insertNodes(
              editor,
              {
                type: typeLi,
                children: [{ type: typeP, children: [{ text: '' }] }],
              },
              { at: listItemPath }
            );
            return;
          }

          /**
           * If not end, split nodes, wrap a list item on the new paragraph and move it to the next list item
           */
          if (!isEnd) {
            Transforms.splitNodes(editor, { at: editor.selection });
            Transforms.wrapNodes(
              editor,
              {
                type: typeLi,
                children: [],
              },
              { at: nextParagraphPath }
            );
            Transforms.moveNodes(editor, {
              at: nextParagraphPath,
              to: nextListItemPath,
            });
          } else {
            /**
             * If end, insert a list item after and select it
             */
            Transforms.insertNodes(
              editor,
              {
                type: typeLi,
                children: [{ type: typeP, children: [{ text: '' }] }],
              },
              { at: nextListItemPath }
            );
            Transforms.select(editor, nextListItemPath);
          }

          /**
           * If there is a list in the list item, move it to the next list item
           */
          if (listItemNode.children.length > 1) {
            Transforms.moveNodes(editor, {
              at: nextParagraphPath,
              to: nextListItemPath.concat(1),
            });
          }

          return;
        }
      }

      // Potential fix for empty links creating shadow nodes which causes issues with lists
      // TODO(prev): check for side effects
      editor.insertText(' ');
    }

    insertBreak();
  };

  const onResetListType = () => {
    unwrapNodesByType(editor, typeLi, { split: true });
    unwrapNodesByType(editor, [typeUl, typeOl], { split: true });
  };

  // eslint-disable-next-line no-param-reassign
  editor = withResetBlockType({
    types: [typeLi],
    defaultType: typeP,
    onUnwrap: onResetListType,
  })(editor);

  return editor;
};
