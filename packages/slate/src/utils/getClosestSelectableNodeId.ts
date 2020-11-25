import { Editor, Node } from 'slate';

export const getClosestSelectableNodeId = (
  editor: Editor
): string | undefined => {
  if (!editor.selection) {
    return undefined;
  }

  const ancestors = Node.ancestors(editor, editor.selection.focus.path, {
    reverse: true,
  });

  if (!ancestors) {
    return undefined;
  }

  const match = Array.from(ancestors).filter(
    ([node]) => !Editor.isInline(editor, node)
  )[0];

  if (!match) {
    return undefined;
  }

  const [node] = match;
  return node.id as string;
};
