import React, { useContext, useRef, useCallback} from "react";
import { ManagerState, Options } from "../interfaces";
import { QueryMethods } from "./query";
import { useCollector } from "craftjs-utils";
import Actions from "./actions";
import { ManagerContext } from "./ManagerContext";
import { EventContext } from "../dnd/DNDManager";

export type useInternalManager<C = null> = (C extends null ? useCollector<typeof Actions, typeof QueryMethods> : useCollector<typeof Actions, typeof QueryMethods, C>) & {
  _inContext: boolean;
  handlers: EventContext
};

export function useInternalManager(): useInternalManager
export function useInternalManager<C>(collector: (state: ManagerState) => C): useInternalManager<C>
export function useInternalManager<C>(collector?: any): useInternalManager<C> {
  const handlers = useContext(EventContext);
  const manager = useContext<ManagerContext>(ManagerContext);
  const collected = manager ? useCollector(manager, collector, (collected, finalize) => finalize(collected)) : {actions: {}};

  return {
    ...collected as any,
    handlers,
    _inContext: !!manager
  }
}
