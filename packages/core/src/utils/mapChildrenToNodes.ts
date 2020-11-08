import React, { ReactNode } from 'react';

import { Node } from '../interfaces';

export function mapChildrenToNodes(
  children: ReactNode,
  cb: (JSX: React.ReactElement | string) => Node
): Node[] {
  return React.Children.toArray(children).reduce(
    (result: Node[], child: any) => {
      const node = cb(child);
      result.push(node);
      return result;
    },
    []
  ) as Node[];
}
