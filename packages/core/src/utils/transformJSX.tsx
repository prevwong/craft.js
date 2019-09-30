import React, { Fragment } from 'react';
import { Canvas } from '../nodes';
import { NodeId, NodeRef, NodeData } from '../interfaces';
import { createNode } from './createNode';
const shortid = require('shortid');

type Extras = { id: NodeId, ref: Partial<NodeRef>, data: Partial<NodeData> };
export function transformJSXToNode(child: React.ReactElement | string, extras: Partial<Extras> = {id: null, ref: {}, data:{}}) {
  if (typeof (child) === "string") {
    child = React.createElement(Fragment, {}, child);
  }
  let { type, props } = child;
  const prefix = type === Canvas ? "canvas" : "node";
  const id = extras.id ? extras.id : `${prefix}-${shortid.generate()}`;

  return createNode({
    type: type,
    props,
    ...extras.data
  }, id, extras.ref);
}
