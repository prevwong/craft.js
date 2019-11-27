import { useRef, useMemo } from "react";
import { useManager } from "craftjs";

export const useHandlerGuard = (handlers: Record<string, (...args) => void>): Record<string, (...args) => void> => {
  const { enabled } = useManager((state) => ({
    enabled: state.options.enabled,
  }));

  const isEnabled = useRef<boolean>(enabled);

  isEnabled.current = enabled;

  return useMemo(() => {
    const guarded = Object.keys(handlers).reduce((acc, key) => {
      acc[key] = (...args) => isEnabled.current ? handlers[key](...args) : {};
      return acc;
    }, {})

    return guarded;
  }, []) as any;
}