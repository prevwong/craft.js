import { useRef, useEffect } from "react";

export function useEventListener(eventName: string, handler: EventListenerOrEventListenerObject, element: Window | HTMLElement = window){
  const savedHandler = useRef(null);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = (event: Event) => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
    
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  );
};