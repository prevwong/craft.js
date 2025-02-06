import React, { Fragment } from 'react';

import { createNode } from './createNode';

import { Node } from '../interfaces';

export function parseNodeFromJSX(
  jsx: React.ReactElement<any> | string,
  normalize?: (node: Node, jsx: React.ReactElement<any>) => void
) {
  let element = jsx as React.ReactElement<any>;

  if (typeof element === 'string') {
    element = React.createElement(Fragment, {}, element) as React.ReactElement<
      any
    >;
  }

  let actualType = element.type as any;

  return createNode(
    {
      data: {
        type: actualType,
        props: { ...element.props },
      },
    },
    (node) => {
      if (normalize) {
        normalize(node, element);
      }
    }
  );
}
