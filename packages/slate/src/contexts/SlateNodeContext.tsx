import { createContext, useContext } from 'react';

export const SlateNodeContext = createContext<any>(null);

export const useSlateNode = () => {
  return useContext(SlateNodeContext);
};
