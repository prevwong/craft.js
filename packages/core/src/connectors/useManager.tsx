import { useInternalManager, ManagerCollector } from "../manager/useInternalManager";
import { useConnectorHooks, ConnectorElementWrapper } from "craftjs-utils";

export type useManager<S = null> = useInternalManager<S> & {
  actions: string
  connectors: { 
    active: ConnectorElementWrapper,
    drag: ConnectorElementWrapper,
    hover: ConnectorElementWrapper
  }
}

export function useManager(): useManager;
export function useManager<S>(collect: ManagerCollector<S>): useManager<S>;

export function useManager<S>(collect?: any): useManager<S> {
  const {handlers, actions: {setDOM, setNodeEvent, ...actions}, ...collected} = collect ? useInternalManager(collect) : useInternalManager();

  const connectors = useConnectorHooks({ 
    active: handlers.selectNode,
    drag: [
      (node, id) => {
        node.setAttribute("draggable", true);
        handlers.dragNode(node, id);
        handlers.dragNodeEnd(node, id);
      },
      (node, id) => {
        node.removeAttribute("draggable", true);
      }
    ],
    hover: handlers.hoverNode
  })

  return {
    connectors,
    actions,
    ...collected as any
  }
}
