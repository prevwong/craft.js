import { Node } from "../interfaces";
import { useInternalNode } from "../nodes/useInternalNode";

export type useNode<S = null> = Omit<useInternalNode<S>, "actions"> &
  Pick<useInternalNode<S>["actions"], "setProp">;

export function useNode(): useNode;

export function useNode<S = null>(collect?: (node: Node) => S): useNode<S>;

/**
 * A Hook to that provides methods and state information related to the corresponding Node that manages the current component.
 * @param collector Collector function to consume values from the corresponding Node's state
 */
export function useNode<S = null>(collect?: (node: Node) => S): useNode<S> {
  const {
    id,
    related,
    actions: { setProp },
    inNodeContext,
    connectors,
    ...collected
  } = useInternalNode(collect);

  return {
    ...(collected as any),
    id,
    related,
    setProp,
    inNodeContext,
    connectors,
  };
}
