import React, { Fragment } from 'react';
import { Canvas } from '../nodes';
import { NodeId, NodeRef, NodeData } from '../interfaces';
import { createNode } from './createNode';
const shortid = require('shortid');

type Extras = { ref: Partial<NodeRef>, data: Partial<NodeData> };
export function transformJSXToNode(child: React.ReactElement | string, hardId?: NodeId,  extras: Partial<Extras> = {ref: {}, data:{}}) {
  if (typeof (child) === "string") {
    child = React.createElement(Fragment, {}, child);
  }
  let { type, props } = child;
  const prefix = type === Canvas ? "canvas" : "node";
  const id = hardId ? hardId : `${prefix}-${shortid.generate()}`;

  return createNode({
    type: type,
    props,
    ...extras.data
  }, id, extras.ref);
}