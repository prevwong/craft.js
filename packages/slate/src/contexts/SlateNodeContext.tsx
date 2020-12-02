import { useNode } from '@craftjs/core';
import React, { createContext, useContext, useState } from 'react';

export const SlateNodeContext = createContext<any>(null);

export const SlateNodeContextProvider: React.FC<any> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const { id } = useNode();

  return (
    <SlateNodeContext.Provider value={{ id, enabled, setEnabled }}>
      {children}
    </SlateNodeContext.Provider>
  );
};

export const useSlateNode = () => {
  const context = useContext(SlateNodeContext);

  return context || {};
};
