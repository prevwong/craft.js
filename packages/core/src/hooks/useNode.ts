import { useInternalNode } from '../nodes/useInternalNode';

/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param collect - Collector function to consume values from the corresponding Node's state
 */
export const useNode = useInternalNode;
