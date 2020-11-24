import { useNode } from '@craftjs/core';
import React, { createContext, useContext } from 'react';

export const SlateRootContext = createContext<any>(null);

export interface SlateRootContextProviderProps {
  renderEditable: React.ReactElement;
  leaf: {
    textProp: string;
  };
}

export const SlateRootContextProvider: React.FC<Partial<
  SlateRootContextProviderProps
>> = ({ children, ...props }) => {
  const { id } = useNode();

  const value = {
    renderEditable: ({ attributes, children }) => {
      return <div {...attributes}>{children}</div>;
    },
    ...(props || {}),
    leaf: {
      textProp: 'text',
      ...((props && props.leaf) || {}),
    },
    id,
  };

  return (
    <SlateRootContext.Provider value={value}>
      {children}
    </SlateRootContext.Provider>
  );
};

export const useSlateRoot = () => {
  return useContext(SlateRootContext);
};
