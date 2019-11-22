import { useInternalManager } from "../../dist/manager/useInternalManager";
import { useRef, useMemo } from "react";
import { EventContext } from "./EventManager";

export const useHandlerGuard = (handlers: EventContext): EventContext => {
  const { enabled } = useInternalManager((state) => ({
    enabled: state.options.enabled,
  }));

  const isEnabled = useRef<boolean>(enabled);

  isEnabled.current = enabled;

  return useMemo(() => {
    const guarded =  Object.keys(handlers).reduce((acc, key) => {
      acc[key] = Object.keys(handlers[key]).reduce((innerAcc, innerKey) => {
        innerAcc[innerKey] = (...args) => isEnabled.current ? handlers[key][innerKey](...args) : {};
        return innerAcc;
      }, {});
      return acc;
    }, {})

    return guarded;
  }, []) as any;
}