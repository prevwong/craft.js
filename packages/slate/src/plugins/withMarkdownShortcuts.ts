import shortid from 'shortid';
import { Editor, Transforms, Range, Point } from 'slate';

// import { BuiltInComponents } from 'craft/constants';
// import { RichTextEditorNodes } from 'craft/constants/richTextEditor';

const { List, ListItem, Typography } = {
  List: 'List',
  ListItem: 'ListItem',
  Typography: 'Typography',
};

const SHORTCUTS = {
  '1.': ListItem,
  '1)': ListItem,
  '*': ListItem,
  '-': ListItem,
  '#': Typography,
  '##': Typography,
  '###': Typography,
  '####': Typography,
  '#####': Typography,
  '######': Typography,
};

export const withMarkdownShortcuts = <T extends Editor>(editor: T) => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = SHORTCUTS[beforeText];

      if (type) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.select(editor, range);
          Transforms.delete(editor);
          Transforms.setNodes(
            editor,
            { type },
            { match: (n) => Editor.isBlock(editor, n) }
          );

          if (type === 'ListItem') {
            const list = { type: 'List', props: {}, custom: {}, children: [] };
            Transforms.wrapNodes(editor, list, {
              match: (n) => n.type === 'ListItem',
            });
          }
        });
        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== 'Typography' &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: 'Typography' });

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: (n) => n.type === 'bulleted-list',
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};
