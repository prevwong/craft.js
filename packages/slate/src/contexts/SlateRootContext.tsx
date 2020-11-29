import { useNode } from '@craftjs/core';
import { Delete } from '@craftjs/utils';
import React, { createContext, useContext } from 'react';
import { ReactEditor, Editable } from 'slate-react';

export const SlateRootContext = createContext<any>(null);

export interface SlateRootContextProviderProps {
  onChange: (value: any) => void;
  editor: ReactEditor;
}

export const SlateRootContextProvider: React.FC<Partial<
  SlateRootContextProviderProps
>> = ({ children, ...props }) => {
  const { id } = useNode();

  const value = {
    ...(props || {}),
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
