import { NodeElement } from '@craftjs/core';
import React from 'react';

import { useSlateSetupContext } from '../SlateSetupProvider';

export const Leaf = (props) => {
  const { leaf: LeafElement } = useSlateSetupContext();

  return <NodeElement id={props.leaf.id} render={<LeafElement {...props} />} />;
};
