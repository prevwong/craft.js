import React from 'react';

import { SimpleElement } from './SimpleElement';

import { NodeId } from '../interfaces';
import { NodeElement } from '../nodes/NodeElement';
import { useInternalNode } from '../nodes/useInternalNode';

export const DefaultRender = () => {
  const { type, props, nodes } = useInternalNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
  }));

  let children = props.children;

  if (nodes && nodes.length > 0) {
    children = (
      <React.Fragment>
        {nodes.map((id: NodeId) => (
          <NodeElement id={id} key={id} />
        ))}
      </React.Fragment>
    );
  }

  const render = React.createElement(type, props, children);

  if (typeof type == 'string') {
    return <SimpleElement render={render} />;
  }

  return render;
};
