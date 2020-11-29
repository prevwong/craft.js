import { useNode } from '@craftjs/core';
import React, { createContext, useContext } from 'react';

export const SlateNodeContext = createContext<any>(null);

export const SlateNodeContextProvider: React.FC = ({ children }) => {
  const { id } = useNode();

  return (
    <SlateNodeContext.Provider value={{ id }}>
      {children}
    </SlateNodeContext.Provider>
  );
};

export const useSlateNode = () => {
  return useContext(SlateNodeContext);
};
