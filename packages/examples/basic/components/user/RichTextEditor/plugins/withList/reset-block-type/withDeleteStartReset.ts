import { Editor, Point, Range, Transforms } from 'slate';

import { WithResetBlockTypeOptions } from './types';

export interface WithDeleteStartResetOptions {
  /**
   * Node types where the plugin applies.
   */
  types: string[];
  /**
   * Default type to set when resetting.
   */
  defaultType?: string;
  /**
   * Callback called when unwrapping.
   */
  onUnwrap?: any;
}

/**
 * When deleting backward at the start of an empty block, reset the block type to a default type.
 */
export const withDeleteStartReset = ({
  defaultType,
  types,
  onUnwrap,
}: WithResetBlockTypeOptions) => <T extends Editor>(editor: T) => {
  const { deleteBackward } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (!!selection && Range.isCollapsed(selection)) {
      const parent = Editor.above(editor, {
        match: (n) => types.includes(n.type as string),
      });

      if (parent) {
        const [, parentPath] = parent;
        const parentStart = Editor.start(editor, parentPath);

        if (selection && Point.equals(selection.anchor, parentStart)) {
          Transforms.setNodes(editor, { type: defaultType });

          if (onUnwrap) {
            onUnwrap();
          }

          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};
