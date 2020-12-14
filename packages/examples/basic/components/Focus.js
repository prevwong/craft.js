import React, { createContext, useContext, useState } from 'react';

export const FocusContext = createContext(null);

export const FocusContextProvider = ({ children }) => {
  const [focus, setFocus] = useState(null);

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  return useContext(FocusContext);
};
