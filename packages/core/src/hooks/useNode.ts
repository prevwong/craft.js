import { deprecationWarning } from '@craftjs/utils';

import { Node } from '../interfaces';
import {
  useInternalNode,
  useInternalNodeReturnType,
} from '../nodes/useInternalNode';

export type useNodeReturnType<S = null> = useInternalNodeReturnType<S> &
  Pick<useInternalNodeReturnType<S>['actions'], 'setProp'>;

export function useNode(): useNodeReturnType;

export function useNode<S = null>(
  collect?: (node: Node) => S
): useNodeReturnType<S>;

/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param collect - Collector function to consume values from the corresponding Node's state
 */
export function useNode<S = null>(
  collect?: (node: Node) => S
): useNodeReturnType<S> {
  const {
    id,
    related,
    actions,
    inNodeContext,
    connectors,
    ...collected
  } = useInternalNode(collect);

  return {
    ...(collected as any),
    actions,
    id,
    related,
    setProp: (cb) => {
      deprecationWarning('useNode().setProp()', {
        suggest: 'useNode().actions.setProp()',
      });
      return actions.setProp(cb);
    },
    inNodeContext,
    connectors,
  };
}
