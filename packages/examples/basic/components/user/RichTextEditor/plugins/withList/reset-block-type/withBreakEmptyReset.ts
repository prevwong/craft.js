import { Editor, Transforms, Text, Ancestor } from 'slate';

import { WithResetBlockTypeOptions } from './types';

const isAllTextEmpty = (node: Ancestor) => {
  const emptyTextChildren = node.children.filter(
    (child) => Text.isText(child) && child.text.length === 0
  );
  return emptyTextChildren.length === node.children.length;
};

/**
 * When inserting break at the start of an empty block, reset the block type to a default type.
 */
export const withBreakEmptyReset = ({
  types,
  defaultType,
  onUnwrap,
}: WithResetBlockTypeOptions) => <T extends Editor>(editor: T) => {
  const { insertBreak } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertBreak = () => {
    const blockEntry = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    }) || [editor, []];

    const [block] = blockEntry;

    if (isAllTextEmpty(block)) {
      const parent = Editor.above(editor, {
        match: (n) => types.includes(n.type as string),
      });

      if (parent) {
        Transforms.setNodes(editor, { type: defaultType });

        if (onUnwrap) {
          onUnwrap();
        }

        return;
      }
    }

    insertBreak();
  };

  return editor;
};
