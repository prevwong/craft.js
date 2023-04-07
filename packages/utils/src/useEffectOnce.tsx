import { useEffect } from 'react';

export const useEffectOnce = (effect: () => void) => {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(effect, []);
};
