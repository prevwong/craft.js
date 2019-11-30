import { useInternalManager, ManagerCollector } from "../manager/useInternalManager";
import { ConnectorElementWrapper} from "craftjs-utils";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type Delete<T, U> = Pick<T, Exclude<keyof T, U>>;

export type useManager<S = null> = 
  Overwrite<useInternalManager<S>, {
    actions: Delete<useInternalManager<S>['actions'], 'setNodeEvent' | 'setDOM'>
  }> & {
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
  
  return {
    connectors: handlers,
    actions,
    ...collected as any
  }
}