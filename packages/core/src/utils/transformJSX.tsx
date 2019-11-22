import React, { Fragment } from 'react';
import { Canvas } from '../nodes';
import { NodeId, NodeData, NodeRules } from '../interfaces';
import { createNode } from './createNode';
const shortid = require('shortid');

type Extras = { id: NodeId, data: Partial<NodeData> };
export function transformJSXToNode(child: React.ReactElement | string, extras: Partial<Extras> = {id: null, data:{}}) {
  if (typeof (child) === "string") {
    child = React.createElement(Fragment, {}, child);
  }
  let { type, props } = child;
  const prefix = (type === Canvas || (extras.data.isCanvas)) ? "canvas" : "node";
  const id = extras.id ? extras.id : `${prefix}-${shortid.generate()}`;

  return createNode({
    type: type,
    props,
    ...extras.data
  }, id);
}
