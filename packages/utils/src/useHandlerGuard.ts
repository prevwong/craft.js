import { useRef, useMemo } from "react";

export function useHandlerGuard<T extends string>(
  handlers: Record<
    T,
    [keyof DocumentEventMap, (e: MouseEvent, options?: any) => void, boolean?]
  >,
  enabled: boolean
): Record<T, (e: any, options?: any) => void> {
  const isEnabled = useRef<boolean>(enabled);
  isEnabled.current = enabled;

  // enable/disable callbacks depending on editor state

  const guarded = Object.keys(handlers).reduce((acc, key) => {
    acc[key] = (...args) =>
      isEnabled.current ? handlers[key][1](...args) : {};
    return acc;
  }, {});

  // create eventslisteners
  const fnRefs = useRef({});
  return useMemo(
    () =>
      Object.keys(guarded).reduce((accum, key) => {
        const ref = fnRefs.current[key] || {};
        accum[key] = (node, opts) => {
          if (node) {
            if (ref.node !== node || ref.opts !== opts) {
              if (ref.unsubscribe) ref.unsubscribe();
            }

            const event = handlers[key][0];
            const listener = e => guarded[key](e, opts);
            const capture = !!handlers[key][2];
            node.addEventListener(event, listener, capture);
            fnRefs.current = {
              node,
              opts,
              unsubscribe: () =>
                node.removeEventListener(event, listener, capture)
            };
          }
        };
        return accum;
      }, {}),
    [handlers, guarded]
  ) as any;
}
