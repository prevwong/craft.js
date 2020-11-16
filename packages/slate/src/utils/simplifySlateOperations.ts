import { Editor, Node, Operation } from 'slate';

export const simplifySlateOperations = (
  rteEditor: Editor,
  operation: Operation
) => {
  let ops: Operation[] = [];

  switch (operation.type) {
    case 'split_node': {
      const { position, path, properties } = operation;
      const node = Node.get(rteEditor, path);

      if (node.type === 'Text') {
        const text = node.text as string;
        const newSiblingTextPath = [
          ...path.slice(0, path.length - 1),
          path[path.length - 1] + 1,
        ];

        const op1: Operation = {
          path,
          offset: position,
          text: text.substring(position, text.length),
          type: 'remove_text',
        };

        const op2: Operation = {
          path: newSiblingTextPath,
          node: {
            ...properties,
            type: 'Text',
            data: { ...(node.data as any) },
            text: text.substring(position, text.length),
          },
          type: 'insert_node',
        };

        ops = [op1, op2];
      } else {
        const newSiblingNodePath = [
          ...path.slice(0, path.length - 1),
          path[path.length - 1] + 1,
        ];
        const childPath = [...path.slice(0, path.length), position];

        const op4 = {
          path: newSiblingNodePath,
          node: {
            ...properties,
            data: { ...(node.data as any) },
            children: [{ type: 'Text', text: ' ' }],
          },
          type: 'insert_node',
        };

        const op5 = {
          path: childPath,
          newPath: [...newSiblingNodePath, 0],
          type: 'move_node',
        };

        // @ts-ignore
        ops = [op4, op5];
      }

      break;
    }
    default: {
      ops = [operation];
      break;
    }
  }

  return ops;
};
