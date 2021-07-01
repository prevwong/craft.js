import { Node } from '../interfaces';
import { getRandomNodeId } from './getRandomNodeId';

export const createNode = (partialNode: Partial<Node> = {}): Node => ({
  id: getRandomNodeId(),
  type: 'div',
  displayName: 'div',
  props: {},
  custom: {},
  parent: null,
  nodes: [],
  linkedNodes: {},
  hidden: false,
  isCanvas: false,
  ...partialNode,
});
