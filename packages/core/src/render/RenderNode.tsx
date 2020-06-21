import React, { useMemo } from 'react';
import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeElement } from '../nodes/NodeElement';
import { SimpleElement } from './SimpleElement';
import { NodeId } from '../interfaces';
import { useInternalNode } from '../nodes/useInternalNode';

const Render = () => {
  const { type, props, nodes, hydrationTimestamp } = useInternalNode(
    (node) => ({
      type: node.data.type,
      props: node.data.props,
      nodes: node.data.nodes,
      hydrationTimestamp: node._hydrationTimestamp,
    })
  );

  return useMemo(() => {
    const render = React.createElement(
      type,
      props,
      <React.Fragment>
        {nodes
          ? nodes.map((id: NodeId) => <NodeElement id={id} key={id} />)
          : props && props.children}
      </React.Fragment>
    );

    if (typeof type == 'string') {
      return <SimpleElement render={render} />;
    }

    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, props, hydrationTimestamp, nodes]);
};

export const RenderNodeToElement: React.FC<any> = () => {
  const { hidden } = useInternalNode((node) => ({
    hidden: node.data.hidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }

  return React.createElement(onRender, { render: <Render /> });
};
