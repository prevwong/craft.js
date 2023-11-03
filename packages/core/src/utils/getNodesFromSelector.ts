import { ERROR_INVALID_NODEID } from 'craftjs-utils-meetovo';
import invariant from 'tiny-invariant';

import { Nodes, Node, NodeSelectorWrapper, NodeSelector } from '../interfaces';

type config = { existOnly: boolean; idOnly: boolean };
export const getNodesFromSelector = (
  nodes: Nodes,
  selector: NodeSelector,
  config?: Partial<config>,
  source?: string
): NodeSelectorWrapper[] => {
  const items = Array.isArray(selector) ? selector : [selector];

  const mergedConfig = {
    existOnly: false,
    idOnly: false,
    ...(config || {}),
  };

  const nodeSelectors = items
    .filter((item) => !!item)
    .map((item) => {
      if (typeof item === 'string') {
        return {
          node: nodes[item],
          exists: !!nodes[item],
        };
      }

      if (typeof item === 'object' && !mergedConfig.idOnly) {
        const node = item as Node;
        return {
          node,
          exists: !!nodes[node.id],
        };
      }

      return {
        node: null,
        exists: false,
      };
    });

  if (mergedConfig.existOnly) {
    if (!(nodeSelectors.filter((selector) => !selector.exists).length === 0)) {
      (window as any).letExistingExceptionThrough = true;
      invariant(
        false,
        `${ERROR_INVALID_NODEID}-Failed to fetch nodes-${source || ''}`
      );
    }
  }

  return nodeSelectors;
};
