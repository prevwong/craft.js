import { useRef, useMemo } from "react";

export function useHandlerGuard<
  T extends string,
>(
  handlers: Record<T, [keyof DocumentEventMap, (e: MouseEvent, options?: any) => void, boolean?]>, 
  enabled
): Record<T, (e: any, options?: any) => void>  {
  const isEnabled = useRef<boolean>(enabled);
  isEnabled.current = enabled;

  // enable/disable callbacks depending on editor state

  const guarded = Object.keys(handlers).reduce((acc, key) => {
      acc[key] = (...args) => isEnabled.current ? handlers[key][1](...args) : {};
      return acc;
    }, {})
  
  // console.log(33, guarded);
  // // create eventslisteners
  const fnRefs = useRef({});
  return useMemo( () => Object.keys(guarded).reduce((accum, key) => {
    const ref = fnRefs.current[key] || {};
    accum[key] = ((node, opts) => {
      if (node) {
        if (ref.node !== node || ref.opts !== opts) {
          if ( ref.unsubscribe ) ref.unsubscribe();
        }

        const event = handlers[key][0];
        const listener = (e) => guarded[key](e, opts);
        const capture = !!handlers[key][2];
        // console.log(33, node, handler, guarded[key], key)
        node.addEventListener(event, listener, capture);
        fnRefs.current = {
          node,
          opts,
          unsubscribe: () => node.removeEventListener(event, listener, capture)
        }
      }
    });
    return accum;
  }, {}), 
  []) as any;

}