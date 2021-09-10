import { deprecationWarning } from '@craftjs/utils';

import { Node } from '../interfaces';
import { useInternalNode } from '../nodes/useInternalNode';

/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param collect - Collector function to consume values from the corresponding Node's state
 */
export function useNode<S = null>(collect?: (node: Node) => S) {
  const {
    id,
    related,
    actions,
    inNodeContext,
    connectors,
    ...collected
  } = useInternalNode(collect);

  return {
    ...collected,
    actions,
    id,
    related,
    setProp: (
      cb: (props: Record<string, any>) => void,
      throttleRate?: number
    ) => {
      deprecationWarning('useNode().setProp()', {
        suggest: 'useNode().actions.setProp()',
      });
      return actions.setProp(cb, throttleRate);
    },
    inNodeContext,
    connectors,
  };
}
